import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, ToggleLeft, ToggleRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onTransactionToggled?: () => void;
}

export default function TransactionList({ transactions, isLoading, onTransactionToggled }: TransactionListProps) {
  const { toast } = useToast();
  const [togglingId, setTogglingId] = useState<number | null>(null);
  
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
  
  const handleToggleStatus = async (id: number) => {
    try {
      setTogglingId(id);
      await apiRequest("POST", `/api/transactions/${id}/toggle`);
      
      if (onTransactionToggled) {
        onTransactionToggled();
      }
      
      toast({
        title: "Statut modifié",
        description: "Le statut de la transaction a été modifié avec succès.",
      });
    } catch (error) {
      console.error("Error toggling transaction status:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du statut.",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
    }
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
              <li 
                key={transaction.id} 
                className={`bg-gray-50 rounded-md p-3 flex justify-between items-center ${transaction.active === 'false' ? 'opacity-60' : ''}`}
              >
                <div>
                  <p className="font-medium text-gray-800">{transaction.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{formatAmount(transaction.amount)} FBU</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 flex-shrink-0"
                    onClick={() => handleToggleStatus(transaction.id)}
                    disabled={togglingId === transaction.id}
                  >
                    {transaction.active === 'true' ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
