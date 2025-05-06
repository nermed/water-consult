import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { transactionsInsertSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for transactions
  app.get('/api/transactions', async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      return res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ error: 'Error fetching transactions' });
    }
  });

  app.get('/api/transactions/stats', async (req, res) => {
    try {
      const stats = await storage.getTransactionStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      return res.status(500).json({ error: 'Error fetching transaction stats' });
    }
  });

  app.post('/api/transactions', async (req, res) => {
    try {
      const validatedData = transactionsInsertSchema.parse(req.body);
      const newTransaction = await storage.createTransaction(validatedData);
      return res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating transaction:', error);
      return res.status(500).json({ error: 'Error creating transaction' });
    }
  });
  
  app.post('/api/transactions/:id/toggle', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid transaction ID' });
      }
      
      const updatedTransaction = await storage.toggleTransactionStatus(id);
      return res.status(200).json(updatedTransaction);
    } catch (error) {
      console.error('Error toggling transaction status:', error);
      return res.status(500).json({ error: 'Error toggling transaction status' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
