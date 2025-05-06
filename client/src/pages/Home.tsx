import { useQuery, useQueryClient } from "@tanstack/react-query";
import SummaryStats from "@/components/SummaryStats";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@shared/schema";
import { Helmet } from "react-helmet";

export default function Home() {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/transactions/stats'],
  });

  const refreshData = () => {
    // Invalidate both transactions list and stats queries
    queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    queryClient.invalidateQueries({ queryKey: ['/api/transactions/stats'] });
  };
  
  const handleTransactionAdded = () => {
    refreshData();
  };
  
  const handleTransactionToggled = () => {
    refreshData();
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50 font-sans">
      <Helmet>
        <title>Gestionnaire de Transactions</title>
        <meta name="description" content="Enregistrez et suivez vos transactions avec notre gestionnaire simple et intuitif." />
      </Helmet>
      
      <div className="max-w-md mx-auto">
        {/* App Header */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Gestionnaire de Transactions</h1>
          <p className="text-gray-600">Enregistrez et suivez vos transactions</p>
        </header>

        {/* Summary Stats */}
        <SummaryStats 
          isLoading={isLoadingStats} 
          transactionCount={stats?.count || 0} 
          totalCount={stats?.totalCount || 0}
          totalAmount={stats?.total || 0} 
          initialTotalAmount={stats?.initialTotal || 0}
        />

        {/* Transaction Form */}
        <TransactionForm onTransactionAdded={handleTransactionAdded} />

        {/* Transaction List */}
        <TransactionList 
          transactions={transactions} 
          isLoading={isLoadingTransactions} 
          onTransactionToggled={handleTransactionToggled}
        />
      </div>
    </div>
  );
}
