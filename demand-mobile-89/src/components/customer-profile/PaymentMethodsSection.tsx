
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

export const PaymentMethodsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No payment methods added yet</p>
            <Button variant="outline" onClick={() => toast.info("Payment method management coming soon")}>
              Add Payment Method
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
