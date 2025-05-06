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
   * Toggle transaction active status
   */
  async toggleTransactionStatus(id: number) {
    // First get the transaction to know its current status
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, id)
    });

    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    // Toggle the status
    const newStatus = transaction.active === 'true' ? 'false' : 'true';
    
    const [updatedTransaction] = await db
      .update(transactions)
      .set({ active: newStatus })
      .where(eq(transactions.id, id))
      .returning();

    return updatedTransaction;
  },

  /**
   * Calculate summary statistics
   */
  async getTransactionStats() {
    const allTransactions = await db.query.transactions.findMany();
    
    // Only count active transactions
    const activeTransactions = allTransactions.filter(
      transaction => transaction.active === 'true'
    );
    
    const count = activeTransactions.length;
    const totalCount = allTransactions.length;
    
    // Sum only active transaction amounts
    const total = activeTransactions.reduce((sum, transaction) => {
      // Handle string or number types for amount
      const amount = typeof transaction.amount === 'string' 
        ? parseFloat(transaction.amount) 
        : transaction.amount;
      return sum + Number(amount);
    }, 0);
    
    // Sum all transaction amounts for initial total
    const initialTotal = allTransactions.reduce((sum, transaction) => {
      // Handle string or number types for amount
      const amount = typeof transaction.amount === 'string' 
        ? parseFloat(transaction.amount) 
        : transaction.amount;
      return sum + Number(amount);
    }, 0);
    
    return {
      count,
      totalCount,
      total,
      initialTotal
    };
  }
};
