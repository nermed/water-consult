import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryStatsProps {
  transactionCount: number;
  totalAmount: number;
  isLoading: boolean;
}

export default function SummaryStats({ 
  transactionCount, 
  totalAmount, 
  isLoading 
}: SummaryStatsProps) {
  const formattedTotal = typeof totalAmount === 'number' 
    ? totalAmount.toFixed(2) 
    : Number(totalAmount).toFixed(2);

  return (
    <Card className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Total des Transactions</p>
          {isLoading ? (
            <Skeleton className="h-7 w-16 mx-auto mt-1" />
          ) : (
            <p className="text-xl font-semibold text-gray-800">{transactionCount}</p>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Montant Total</p>
          {isLoading ? (
            <Skeleton className="h-7 w-24 mx-auto mt-1" />
          ) : (
            <p className="text-xl font-semibold text-gray-800">{formattedTotal} €</p>
          )}
        </div>
      </div>
    </Card>
  );
}
