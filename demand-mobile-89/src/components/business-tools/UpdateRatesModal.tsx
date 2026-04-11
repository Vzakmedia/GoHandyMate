
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wrench, Zap } from "lucide-react";
import { toast } from "sonner";

interface UpdateRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
}

export const UpdateRatesModal = ({ isOpen, onClose, currentRate }: UpdateRatesModalProps) => {
  const [baseRate, setBaseRate] = useState(currentRate.toString());
  const [emergencyRate, setEmergencyRate] = useState((currentRate * 2).toString());
  const [sameDayRate, setSameDayRate] = useState((currentRate * 1.5).toString());

  const handleSave = async () => {
    try {
      // Here you would typically save to your backend/database
      toast.success("Rates updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update rates. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span>Update Your Rates</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Rate Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Rate Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Wrench className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">${Math.round(currentRate)}/hr</div>
                  <div className="text-sm text-gray-600">Standard Rate</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">${Math.round(currentRate * 1.5)}/hr</div>
                  <div className="text-sm text-gray-600">Same Day</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <Zap className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">${Math.round(currentRate * 2)}/hr</div>
                  <div className="text-sm text-gray-600">Emergency</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Update Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="baseRate">Standard Rate ($/hr)</Label>
                  <Input
                    id="baseRate"
                    type="number"
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    placeholder="50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your regular hourly rate</p>
                </div>
                
                <div>
                  <Label htmlFor="sameDayRate">Same Day Rate ($/hr)</Label>
                  <Input
                    id="sameDayRate"
                    type="number"
                    value={sameDayRate}
                    onChange={(e) => setSameDayRate(e.target.value)}
                    placeholder="75"
                  />
                  <p className="text-xs text-gray-500 mt-1">Jobs scheduled same day</p>
                </div>
                
                <div>
                  <Label htmlFor="emergencyRate">Emergency Rate ($/hr)</Label>
                  <Input
                    id="emergencyRate"
                    type="number"
                    value={emergencyRate}
                    onChange={(e) => setEmergencyRate(e.target.value)}
                    placeholder="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Urgent/after-hours jobs</p>
                </div>
              </div>

              {/* Rate Comparison */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Rate Comparison</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Standard: ${baseRate}/hr → ${sameDayRate}/hr (+{Math.round(((parseFloat(sameDayRate) - parseFloat(baseRate)) / parseFloat(baseRate)) * 100)}%)</div>
                  <div>Emergency: ${baseRate}/hr → ${emergencyRate}/hr (+{Math.round(((parseFloat(emergencyRate) - parseFloat(baseRate)) / parseFloat(baseRate)) * 100)}%)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Rates
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
