import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryStatsProps {
  transactionCount: number;
  totalCount?: number;
  totalAmount: number;
  initialTotalAmount?: number;
  isLoading: boolean;
}

export default function SummaryStats({ 
  transactionCount, 
  totalCount, 
  totalAmount, 
  initialTotalAmount,
  isLoading 
}: SummaryStatsProps) {
  const formattedTotal = typeof totalAmount === 'number' 
    ? totalAmount.toFixed(2) 
    : Number(totalAmount).toFixed(2);
    
  const formattedInitialTotal = initialTotalAmount && (typeof initialTotalAmount === 'number' 
    ? initialTotalAmount.toFixed(2) 
    : Number(initialTotalAmount).toFixed(2));

  return (
    <Card className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center">
          <p className="text-sm text-gray-500">Transactions Actives</p>
          {isLoading ? (
            <Skeleton className="h-7 w-16 mx-auto mt-1" />
          ) : (
            <p className="text-xl font-semibold text-gray-800">{transactionCount}<span className="text-sm text-gray-400">/{totalCount || transactionCount}</span></p>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Montant Restant</p>
          {isLoading ? (
            <Skeleton className="h-7 w-24 mx-auto mt-1" />
          ) : (
            <p className="text-xl font-semibold text-gray-800">{formattedTotal} €</p>
          )}
        </div>
      </div>
      
      {initialTotalAmount && initialTotalAmount !== totalAmount && (
        <div className="text-center border-t pt-3">
          <p className="text-sm text-gray-500">Montant Initial</p>
          {isLoading ? (
            <Skeleton className="h-7 w-24 mx-auto mt-1" />
          ) : (
            <p className="text-lg font-medium text-gray-700">{formattedInitialTotal} €</p>
          )}
        </div>
      )}
    </Card>
  );
}
