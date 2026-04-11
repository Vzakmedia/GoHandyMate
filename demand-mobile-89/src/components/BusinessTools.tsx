
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, FileText, TrendingUp, Calendar, DollarSign, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UpdateRatesModal } from "@/components/business-tools/UpdateRatesModal";
import { ExportReportModal } from "@/components/business-tools/ExportReportModal";
import { SetAvailabilityModal } from "@/components/business-tools/SetAvailabilityModal";

interface BusinessToolsProps {
  monthlyEarnings: number;
  thisMonthJobs: number;
  averageRate: number;
}

export const BusinessTools = ({ monthlyEarnings, thisMonthJobs, averageRate }: BusinessToolsProps) => {
  const [showUpdateRates, setShowUpdateRates] = useState(false);
  const [showExportReport, setShowExportReport] = useState(false);
  const [showSetAvailability, setShowSetAvailability] = useState(false);

  // Calculate business insights
  const projectedAnnualEarnings = monthlyEarnings * 12;
  const averageJobValue = thisMonthJobs > 0 ? monthlyEarnings / thisMonthJobs : 0;
  
  const tools = [
    {
      icon: Calculator,
      title: "Pricing Calculator",
      description: `Current avg rate: $${Math.round(averageRate)}/hr`,
      action: "Calculate",
      color: "bg-blue-100 text-blue-700",
      stats: `${thisMonthJobs} jobs this month`,
      onClick: () => {
        toast.success("Opening pricing calculator...");
        // This could open a pricing calculator modal or navigate to a pricing page
      }
    },
    {
      icon: FileText,
      title: "Invoice Generator",
      description: monthlyEarnings > 0 
        ? `$${monthlyEarnings} to invoice this month`
        : "Create professional invoices",
      action: "Generate",
      color: "bg-green-100 text-green-700",
      stats: averageJobValue > 0 ? `$${Math.round(averageJobValue)} avg job` : "No jobs yet",
      onClick: () => {
        toast.success("Opening invoice generator...");
        // This could open an invoice generator modal or navigate to an invoice page
      }
    },
    {
      icon: TrendingUp,
      title: "Revenue Analytics",
      description: projectedAnnualEarnings > 0 
        ? `Projected: $${Math.round(projectedAnnualEarnings)}/year`
        : "Track your business growth",
      action: "Analyze",
      color: "bg-purple-100 text-purple-700",
      stats: monthlyEarnings > 0 ? "Based on current performance" : "Complete jobs to see trends",
      onClick: () => {
        toast.success("Opening revenue analytics...");
        // This could open an analytics dashboard or navigate to analytics page
      }
    },
    {
      icon: Calendar,
      title: "Schedule Optimizer",
      description: thisMonthJobs > 0 
        ? `${thisMonthJobs} jobs scheduled this month`
        : "Optimize your availability",
      action: "Optimize",
      color: "bg-orange-100 text-orange-700",
      stats: averageRate > 0 ? `$${Math.round(averageRate)}/hr earning potential` : "Set your rates first",
      onClick: () => {
        toast.success("Opening schedule optimizer...");
        // This could open a schedule optimization tool
      }
    }
  ];

  const handleUpdateRates = () => {
    setShowUpdateRates(true);
  };

  const handleExportReport = () => {
    setShowExportReport(true);
  };

  const handleSetAvailability = () => {
    setShowSetAvailability(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Business Tools</span>
          </CardTitle>
          <CardDescription>
            {monthlyEarnings > 0 
              ? `Manage your $${monthlyEarnings} monthly business with ${thisMonthJobs} active jobs`
              : "Essential tools to grow your handyman business"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Business Overview */}
          {monthlyEarnings > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="py-2">
                  <div className="text-lg sm:text-xl font-bold text-blue-600">${monthlyEarnings}</div>
                  <div className="text-xs text-gray-600">Monthly Revenue</div>
                </div>
                <div className="py-2">
                  <div className="text-lg sm:text-xl font-bold text-green-600">{thisMonthJobs}</div>
                  <div className="text-xs text-gray-600">Jobs This Month</div>
                </div>
                <div className="py-2">
                  <div className="text-lg sm:text-xl font-bold text-purple-600">${Math.round(averageRate)}</div>
                  <div className="text-xs text-gray-600">Hourly Rate</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <div key={index} className="p-3 sm:p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${tool.color}`}>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base">{tool.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{tool.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
                        <Badge variant="outline" className="text-xs w-fit">
                          {tool.stats}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={tool.onClick} className="w-fit text-xs">
                          {tool.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <Button size="sm" className="flex items-center justify-center space-x-2" onClick={handleUpdateRates}>
                <DollarSign className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Update Rates</span>
              </Button>
              <Button size="sm" variant="outline" className="flex items-center justify-center space-x-2" onClick={handleExportReport}>
                <FileText className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Export Report</span>
              </Button>
              <Button size="sm" variant="outline" className="flex items-center justify-center space-x-2" onClick={handleSetAvailability}>
                <Calendar className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Set Availability</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <UpdateRatesModal 
        isOpen={showUpdateRates} 
        onClose={() => setShowUpdateRates(false)}
        currentRate={averageRate}
      />
      <ExportReportModal 
        isOpen={showExportReport} 
        onClose={() => setShowExportReport(false)}
        monthlyEarnings={monthlyEarnings}
        thisMonthJobs={thisMonthJobs}
      />
      <SetAvailabilityModal 
        isOpen={showSetAvailability} 
        onClose={() => setShowSetAvailability(false)}
      />
    </>
  );
};
