import { db } from "./index";
import * as schema from "@shared/schema";
import { TransactionInsert } from "@shared/schema";

async function seed() {
  try {
    return;
    // Check if there's existing data
    const existingTransactions = await db.query.transactions.findMany({
      limit: 1
    });

    // Only seed if there are no transactions
    if (existingTransactions.length === 0) {
      console.log("Seeding transactions...");
      
      const sampleTransactions = [
        {
          name: "Courses Supermarché",
          amount: "150",
          date: new Date("2023-04-28")
        },
        {
          name: "Loyer Avril",
          amount: "800",
          date: new Date("2023-04-01")
        },
        {
          name: "Abonnement Gym",
          amount: "400",
          date: new Date("2023-04-15")
        }
      ];
      
      // Insert sample transactions
      await db.insert(schema.transactions).values(sampleTransactions);
      
      console.log("Seed completed successfully!");
    } else {
      console.log("Database already has transactions, skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
