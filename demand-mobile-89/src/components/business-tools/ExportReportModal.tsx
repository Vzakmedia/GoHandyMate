
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Download, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyEarnings: number;
  thisMonthJobs: number;
}

export const ExportReportModal = ({ isOpen, onClose, monthlyEarnings, thisMonthJobs }: ExportReportModalProps) => {
  const [reportType, setReportType] = useState("monthly");
  const [format, setFormat] = useState("pdf");

  const generateReport = async () => {
    try {
      // Generate mock report data
      const reportData = {
        type: reportType,
        format: format,
        earnings: monthlyEarnings,
        jobs: thisMonthJobs,
        generatedAt: new Date().toISOString()
      };

      // Create a simple CSV or text report
      let content = "";
      let filename = "";
      let mimeType = "";

      if (format === "csv") {
        content = `Report Type,${reportType}\n`;
        content += `Generated At,${new Date().toLocaleDateString()}\n`;
        content += `Total Earnings,$${monthlyEarnings}\n`;
        content += `Total Jobs,${thisMonthJobs}\n`;
        content += `Average per Job,$${thisMonthJobs > 0 ? Math.round(monthlyEarnings / thisMonthJobs) : 0}\n`;
        filename = `handyman-report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = "text/csv";
      } else {
        content = `Handyman Business Report\n\n`;
        content += `Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}\n`;
        content += `Generated: ${new Date().toLocaleDateString()}\n\n`;
        content += `SUMMARY\n`;
        content += `Total Earnings: $${monthlyEarnings}\n`;
        content += `Total Jobs: ${thisMonthJobs}\n`;
        content += `Average per Job: $${thisMonthJobs > 0 ? Math.round(monthlyEarnings / thisMonthJobs) : 0}\n\n`;
        content += `This report contains your business performance data.\n`;
        filename = `handyman-report-${reportType}-${new Date().toISOString().split('T')[0]}.txt`;
        mimeType = "text/plain";
      }

      // Create and download the file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully!`);
      onClose();
    } catch (error) {
      toast.error("Failed to export report. Please try again.");
    }
  };

  const reportTypes = [
    { value: "daily", label: "Daily Report", description: "Today's performance" },
    { value: "weekly", label: "Weekly Report", description: "Last 7 days" },
    { value: "monthly", label: "Monthly Report", description: "This month's data" },
    { value: "quarterly", label: "Quarterly Report", description: "Last 3 months" },
    { value: "yearly", label: "Yearly Report", description: "Full year overview" }
  ];

  const formats = [
    { value: "pdf", label: "PDF", description: "Formatted document" },
    { value: "csv", label: "CSV", description: "Spreadsheet data" },
    { value: "txt", label: "Text", description: "Plain text file" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Export Business Report</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">${monthlyEarnings}</div>
                  <div className="text-sm text-gray-600">Monthly Earnings</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{thisMonthJobs}</div>
                  <div className="text-sm text-gray-600">Jobs Completed</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">${thisMonthJobs > 0 ? Math.round(monthlyEarnings / thisMonthJobs) : 0}</div>
                  <div className="text-sm text-gray-600">Avg per Job</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="format">File Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((fmt) => (
                        <SelectItem key={fmt.value} value={fmt.value}>
                          <div>
                            <div className="font-medium">{fmt.label}</div>
                            <div className="text-xs text-gray-500">{fmt.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Report Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Report Will Include:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Performance summary and key metrics</li>
                  <li>• Earnings breakdown and trends</li>
                  <li>• Job completion statistics</li>
                  <li>• Date range: {reportType} period</li>
                  <li>• Format: {formats.find(f => f.value === format)?.label}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={generateReport} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
