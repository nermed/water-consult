import { db } from "@db";
import { transactions } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { TransactionInsert } from "@shared/schema";

export const storage = {
  /**
   * Get all transactions ordered by date (newest first)
   */
  async getAllTransactions() {
    return await db.query.transactions.findMany({
      orderBy: desc(transactions.date)
    });
  },

  /**
   * Get transaction by ID
   */
  async getTransactionById(id: number) {
    return await db.query.transactions.findFirst({
      where: eq(transactions.id, id)
    });
  },

  /**
   * Create a new transaction
   */
  async createTransaction(transaction: TransactionInsert) {
    const [newTransaction] = await db.insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  },

  /**
   * Calculate summary statistics
   */
  async getTransactionStats() {
    const allTransactions = await db.query.transactions.findMany();
    
    const count = allTransactions.length;
    
    // Sum all transaction amounts
    const total = allTransactions.reduce((sum, transaction) => {
      // Handle string or number types for amount
      const amount = typeof transaction.amount === 'string' 
        ? parseFloat(transaction.amount) 
        : transaction.amount;
      return sum + Number(amount);
    }, 0);
    
    return {
      count,
      total
    };
  }
};
