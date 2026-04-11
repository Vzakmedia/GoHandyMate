
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, User, Calendar, DollarSign } from 'lucide-react';

interface QuoteSubmission {
  id: string;
  handyman_id: string;
  quoted_price: number;
  description: string;
  status: string;
  created_at: string;
  estimated_hours?: number;
  availability_note?: string;
  materials_included?: boolean;
  materials_cost?: number;
  travel_fee?: number;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface AcceptedQuoteDetailsProps {
  submission: QuoteSubmission;
  serviceName: string;
  onRatingSubmitted?: () => void;
}

export const AcceptedQuoteDetails = ({ 
  submission, 
  serviceName, 
  onRatingSubmitted 
}: AcceptedQuoteDetailsProps) => {
  const handleRateJob = () => {
    // Rating functionality has been removed
    console.log('Rating functionality unavailable');
  };

  // Get the handyman's name, with fallback to 'Service Provider'
  const handymanName = submission.profiles?.full_name || 'Service Provider';

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Accepted Quote
          <Badge className="bg-green-100 text-green-800">
            {submission.status === 'completed' ? 'Completed' : 'In Progress'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">
                  {handymanName}
                </p>
                <p className="text-sm text-gray-600">Service Provider</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-600">
                  ${submission.quoted_price}
                </p>
                <p className="text-sm text-gray-600">Quote Price</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {submission.estimated_hours && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">
                    {submission.estimated_hours} hours
                  </p>
                  <p className="text-sm text-gray-600">Estimated Duration</p>
                </div>
              </div>
            )}

            {submission.materials_included && (
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-xs">
                  Materials Included
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="text-sm text-gray-700">{submission.description}</p>
        </div>

        {submission.availability_note && (
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Availability:</strong> {submission.availability_note}
            </p>
          </div>
        )}

        {submission.status === 'completed' && (
          <div className="flex justify-end pt-3 border-t">
            <Button 
              onClick={handleRateJob}
              disabled
              className="bg-gray-400 hover:bg-gray-400"
              size="sm"
            >
              <Star className="w-4 h-4 mr-1" />
              Rating Unavailable
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
