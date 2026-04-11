
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, Wrench, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface QuoteBreakdownProps {
  quote: {
    laborCost: number;
    materialCosts: number;
    surcharges: number;
    platformFee: number;
    subtotal: number;
    total: number;
    suggestedRange: {
      min: number;
      max: number;
    };
  };
  isCalculating: boolean;
}

export const QuoteBreakdown = ({ quote, isCalculating }: QuoteBreakdownProps) => {
  if (isCalculating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Quote Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span>Live Quote Preview</span>
          </div>
          <Badge className="bg-green-600 text-white">
            ${quote.total.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Breakdown Items */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Labor Cost</span>
            </div>
            <span className="font-medium">${quote.laborCost.toFixed(2)}</span>
          </div>

          {quote.materialCosts > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Material Costs</span>
              </div>
              <span className="font-medium">${quote.materialCosts.toFixed(2)}</span>
            </div>
          )}

          {quote.surcharges > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm">Surcharges</span>
              </div>
              <span className="font-medium text-orange-600">${quote.surcharges.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Platform Service Fee (8%)</span>
            <span>${quote.platformFee.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Subtotal */}
        <div className="flex justify-between items-center font-medium">
          <span>Subtotal</span>
          <span>${quote.subtotal.toFixed(2)}</span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold text-green-600">
          <span>Total Quote</span>
          <span>${quote.total.toFixed(2)}</span>
        </div>

        {/* Suggested Range */}
        {quote.suggestedRange.min > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              <strong>Suggested Range:</strong> ${quote.suggestedRange.min.toFixed(2)} - ${quote.suggestedRange.max.toFixed(2)}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Based on standard service zone rates
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
