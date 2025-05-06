import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function TransactionList({ transactions, isLoading }: TransactionListProps) {
  const formatDate = (date: Date | string) => {
    if (!date) return "";
    
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "dd/MM/yyyy", { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const formatAmount = (amount: string | number) => {
    if (typeof amount === "number") {
      return amount.toFixed(2);
    }
    return parseFloat(amount).toFixed(2);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md p-6">
      <CardContent className="p-0">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Transactions Récentes</h2>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-gray-50 rounded-md p-3 flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2" />
            <p>Aucune transaction enregistrée</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="bg-gray-50 rounded-md p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{transaction.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                </div>
                <span className="font-semibold text-gray-800">{formatAmount(transaction.amount)} €</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
