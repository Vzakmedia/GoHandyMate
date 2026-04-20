
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Send, Save, Eye, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { QuotePreview } from "./quote/QuotePreview";
import { QuoteBreakdown } from "./quote/QuoteBreakdown";
import { useQuoteCalculator } from "@/hooks/useQuoteCalculator";
import { useAuth } from '@/features/auth';

interface QuickQuoteCalculatorProps {
  jobId?: string;
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  onQuoteSent?: (quoteData: any) => void;
  onSaveDraft?: (quoteData: any) => void;
  className?: string;
}

export const QuickQuoteCalculator = ({
  jobId,
  customerInfo,
  onQuoteSent,
  onSaveDraft,
  className = ""
}: QuickQuoteCalculatorProps) => {
  const { user, profile } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    formData,
    updateFormData,
    calculatedQuote,
    isCalculating,
    sendQuote,
    saveDraft,
    isSending,
    isSaving
  } = useQuoteCalculator(jobId);

  const serviceCategories = [
    "Plumbing",
    "Electrical",
    "Painting",
    "Carpentry",
    "HVAC",
    "Smart Home",
    "Flooring",
    "Roofing",
    "Landscaping",
    "General Maintenance",
    "Kitchen Renovation",
    "Bathroom Renovation",
    "Drywall Repair",
    "Tile Installation",
    "Custom Project"
  ];

  const rateTypes = [
    { value: "hourly", label: "Hourly Rate" },
    { value: "fixed", label: "Fixed Price" },
    { value: "per_unit", label: "Per Unit/Item" },
    { value: "per_sqft", label: "Per Square Foot" }
  ];

  const handleSendQuote = async () => {
    if (!customerInfo?.email) {
      toast.error("Customer email is required to send quote");
      return;
    }

    try {
      await sendQuote(customerInfo);
      onQuoteSent?.(calculatedQuote);
      toast.success("Quote sent successfully!");
    } catch (error) {
      toast.error("Failed to send quote");
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveDraft();
      onSaveDraft?.(calculatedQuote);
      toast.success("Quote saved as draft");
    } catch (error) {
      toast.error("Failed to save draft");
    }
  };

  const isFormValid = formData.serviceCategory && 
                     formData.estimatedHours > 0 && 
                     formData.rateType && 
                     formData.rateValue > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span>Quick Quote Calculator</span>
            {calculatedQuote.total > 0 && (
              <Badge variant="outline" className="ml-auto">
                Live Quote: ${calculatedQuote.total.toFixed(2)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceCategory">Service Category *</Label>
              <Select
                value={formData.serviceCategory}
                onValueChange={(value) => updateFormData({ serviceCategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="zipCode">Service Location (Zip Code)</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => updateFormData({ zipCode: e.target.value })}
                placeholder="Enter zip code"
                maxLength={10}
              />
            </div>
          </div>

          {/* Job Details */}
          <div>
            <Label htmlFor="jobDescription">Job Description & Scope</Label>
            <Textarea
              id="jobDescription"
              value={formData.jobDescription}
              onChange={(e) => updateFormData({ jobDescription: e.target.value })}
              placeholder="Describe the work to be done, including specific requirements, materials needed, and any special considerations..."
              className="min-h-24"
            />
          </div>

          {/* Time and Rate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="estimatedHours">Estimated Time (Hours) *</Label>
              <Input
                id="estimatedHours"
                type="number"
                step="0.5"
                min="0.5"
                value={formData.estimatedHours}
                onChange={(e) => updateFormData({ estimatedHours: parseFloat(e.target.value) || 0 })}
                placeholder="2.5"
              />
            </div>

            <div>
              <Label htmlFor="rateType">Rate Type *</Label>
              <Select
                value={formData.rateType}
                onValueChange={(value) => updateFormData({ rateType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rate type" />
                </SelectTrigger>
                <SelectContent>
                  {rateTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rateValue">Rate Amount * ($)</Label>
              <Input
                id="rateValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.rateValue}
                onChange={(e) => updateFormData({ rateValue: parseFloat(e.target.value) || 0 })}
                placeholder="75.00"
              />
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
            />
            <Label>Show Advanced Options</Label>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="materialCosts">Material Costs ($)</Label>
                  <Input
                    id="materialCosts"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.materialCosts}
                    onChange={(e) => updateFormData({ materialCosts: parseFloat(e.target.value) || 0 })}
                    placeholder="150.00"
                  />
                </div>

                <div>
                  <Label htmlFor="units">Number of Units</Label>
                  <Input
                    id="units"
                    type="number"
                    min="1"
                    value={formData.units}
                    onChange={(e) => updateFormData({ units: parseInt(e.target.value) || 1 })}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isAfterHours}
                    onCheckedChange={(checked) => updateFormData({ isAfterHours: checked })}
                  />
                  <Label>After-hours/Emergency surcharge</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isUrgent}
                    onCheckedChange={(checked) => updateFormData({ isUrgent: checked })}
                  />
                  <Label>Urgent priority</Label>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Live Quote Breakdown */}
          {isFormValid && (
            <QuoteBreakdown 
              quote={{
                laborCost: calculatedQuote.laborHours * calculatedQuote.laborRate,
                materialCosts: calculatedQuote.materialCosts,
                surcharges: 0,
                platformFee: calculatedQuote.tax,
                subtotal: calculatedQuote.subtotal,
                total: calculatedQuote.total,
                suggestedRange: {
                  min: calculatedQuote.total * 0.9,
                  max: calculatedQuote.total * 1.1
                }
              }}
              isCalculating={isCalculating}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              disabled={!isFormValid}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Quote
            </Button>

            <Button
              onClick={handleSaveDraft}
              variant="outline"
              disabled={!isFormValid || isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>

            {customerInfo?.email && (
              <Button
                onClick={handleSendQuote}
                disabled={!isFormValid || isSending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? "Sending..." : "Send to Customer"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quote Preview Modal */}
      {showPreview && (
        <QuotePreview
          quote={{
            laborCost: calculatedQuote.laborHours * calculatedQuote.laborRate,
            materialCosts: calculatedQuote.materialCosts,
            surcharges: 0,
            platformFee: calculatedQuote.tax,
            subtotal: calculatedQuote.subtotal,
            total: calculatedQuote.total
          }}
          formData={formData}
          customerInfo={customerInfo}
          contractorInfo={{
            name: profile?.full_name || user?.email || "Handyman",
            email: user?.email || "",
            phone: profile?.phone || ""
          }}
          onClose={() => setShowPreview(false)}
          onSend={handleSendQuote}
          isSending={isSending}
        />
      )}
    </div>
  );
};
