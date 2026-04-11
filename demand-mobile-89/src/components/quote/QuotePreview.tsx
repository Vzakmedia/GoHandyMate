
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Send, Download, X } from "lucide-react";

interface QuotePreviewProps {
  quote: {
    laborCost: number;
    materialCosts: number;
    surcharges: number;
    platformFee: number;
    subtotal: number;
    total: number;
  };
  formData: {
    serviceCategory: string;
    jobDescription: string;
    estimatedHours: number;
    rateType: string;
    rateValue: number;
    materialCosts: number;
    units: number;
    zipCode: string;
    isAfterHours: boolean;
    isUrgent: boolean;
  };
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  contractorInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  onClose: () => void;
  onSend: () => void;
  isSending: boolean;
}

export const QuotePreview = ({
  quote,
  formData,
  customerInfo,
  contractorInfo,
  onClose,
  onSend,
  isSending
}: QuotePreviewProps) => {
  const currentDate = new Date().toLocaleDateString();
  const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Quote Preview
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-green-600">GoHandyMate</h1>
            <p className="text-lg font-semibold">Service Quote</p>
            <p className="text-sm text-gray-600">Quote Date: {currentDate}</p>
          </div>

          {/* Contractor & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Service Provider</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{contractorInfo.name}</p>
                <p>{contractorInfo.email}</p>
                {contractorInfo.phone && <p>{contractorInfo.phone}</p>}
              </CardContent>
            </Card>

            {customerInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quote For</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p className="font-medium">{customerInfo.name}</p>
                  <p>{customerInfo.email}</p>
                  {customerInfo.phone && <p>{customerInfo.phone}</p>}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Service Category:</span>
                <Badge variant="outline">{formData.serviceCategory}</Badge>
              </div>
              
              {formData.zipCode && (
                <div className="flex justify-between">
                  <span className="font-medium">Service Location:</span>
                  <span>{formData.zipCode}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="font-medium">Estimated Time:</span>
                <span>{formData.estimatedHours} hours</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Rate Type:</span>
                <span className="capitalize">{formData.rateType.replace('_', ' ')}</span>
              </div>

              {formData.jobDescription && (
                <div>
                  <p className="font-medium mb-2">Description:</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {formData.jobDescription}
                  </p>
                </div>
              )}

              {(formData.isAfterHours || formData.isUrgent) && (
                <div className="flex space-x-2">
                  {formData.isAfterHours && (
                    <Badge variant="secondary">After Hours</Badge>
                  )}
                  {formData.isUrgent && (
                    <Badge variant="secondary">Urgent</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quote Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quote Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Labor Cost</span>
                <span>${quote.laborCost.toFixed(2)}</span>
              </div>

              {quote.materialCosts > 0 && (
                <div className="flex justify-between">
                  <span>Material Costs</span>
                  <span>${quote.materialCosts.toFixed(2)}</span>
                </div>
              )}

              {quote.surcharges > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Surcharges</span>
                  <span>${quote.surcharges.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-600">
                <span>Platform Service Fee</span>
                <span>${quote.platformFee.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">${quote.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <Card>
            <CardContent className="text-xs text-gray-600 space-y-2 pt-6">
              <p><strong>Quote Valid Until:</strong> {validUntil}</p>
              <p><strong>Terms:</strong> This quote is an estimate based on the information provided. Final pricing may vary based on actual scope of work and unforeseen circumstances.</p>
              <p><strong>Payment:</strong> Payment is due upon completion of work unless otherwise agreed upon.</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            
            {customerInfo?.email && (
              <Button
                onClick={onSend}
                disabled={isSending}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? "Sending..." : "Send to Customer"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
