import { pgTable, text, serial, timestamp, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').defaultNow().notNull()
});

export const transactionsInsertSchema = createInsertSchema(transactions, {
  name: (schema) => schema.min(1, "Le nom est requis"),
  amount: (schema) => schema.refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Le montant doit être positif")
});

export type TransactionInsert = z.infer<typeof transactionsInsertSchema>;
export const transactionsSelectSchema = createSelectSchema(transactions);
export type Transaction = z.infer<typeof transactionsSelectSchema>;

// Users table kept as is since it's in the original schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
