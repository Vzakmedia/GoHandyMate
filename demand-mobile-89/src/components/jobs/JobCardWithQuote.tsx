
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, DollarSign, Calculator, Phone, MessageSquare, Eye } from "lucide-react";
import { Job } from "@/types/job";
import { JobActionButtons } from "./JobActionButtons";
import { QuickQuoteCalculator } from "../QuickQuoteCalculator";

interface JobCardWithQuoteProps {
  job: Job;
  onJobUpdated?: () => void;
  onViewDetails?: () => void;
}

export const JobCardWithQuote = ({ job, onJobUpdated, onViewDetails }: JobCardWithQuoteProps) => {
  const [showQuoteCalculator, setShowQuoteCalculator] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'new_request':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleQuoteSent = (quoteData: any) => {
    console.log('Quote sent for job:', job.id, quoteData);
    setShowQuoteCalculator(false);
    onJobUpdated?.();
  };

  const customerInfo = {
    name: job.customerName,
    email: job.customerEmail || `customer${job.id}@example.com`,
    phone: job.customerPhone
  };

  return (
    <>
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-lg truncate">{job.title}</h4>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{job.description}</p>
            </div>
            <Badge className={`${getStatusColor(job.status)} shrink-0`}>
              {job.status.replace('_', ' ')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 text-sm">
            <div className="flex items-center space-x-2 text-gray-600 min-w-0">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="truncate">{job.scheduledDate} ({job.estimatedDuration})</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600 shrink-0" />
              <span className="font-semibold text-green-600">${job.price}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 min-w-0">
              <span className="truncate">{job.customerName}</span>
            </div>
          </div>

          {/* Enhanced Action Buttons with Quote Calculator */}
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={onViewDetails}
              className="flex-1 sm:flex-none"
            >
              <Eye className="w-4 h-4 mr-1" />
              Details
            </Button>

            {(job.status === 'new_request' || job.status === 'pending') && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowQuoteCalculator(true)}
                className="flex-1 sm:flex-none bg-blue-50 hover:bg-blue-100 text-blue-700"
              >
                <Calculator className="w-4 h-4 mr-1" />
                Quote
              </Button>
            )}

            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Message
            </Button>

            <JobActionButtons 
              job={job}
              onJobUpdated={onJobUpdated}
              onViewDetails={onViewDetails}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quote Calculator Modal */}
      {showQuoteCalculator && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-4xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Create Quote for Job</h2>
                  <p className="text-gray-600">{job.title} - {customerInfo.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuoteCalculator(false)}
                >
                  ×
                </Button>
              </div>
              
              <QuickQuoteCalculator
                jobId={job.id.toString()}
                customerInfo={customerInfo}
                onQuoteSent={handleQuoteSent}
                onSaveDraft={() => console.log('Quote saved as draft')}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
