
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Clock, DollarSign, FileText, CheckCircle, AlertCircle, Package, Car, Loader2 } from 'lucide-react';

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

interface QuoteSubmissionCardProps {
  submission: QuoteSubmission;
  onAccept: (quoteId: string) => void;
  isAccepted?: boolean;
  isAccepting?: boolean;
}

export const QuoteSubmissionCard = ({ 
  submission, 
  onAccept, 
  isAccepted = false,
  isAccepting = false
}: QuoteSubmissionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const totalCost = submission.quoted_price + (submission.materials_cost || 0) + (submission.travel_fee || 0);

  return (
    <Card className={`${isAccepted ? 'border-green-500 bg-green-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                {submission.profiles?.full_name || 'Handyman'}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {submission.profiles?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(submission.status)}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(submission.status)}
                <span className="capitalize">{submission.status}</span>
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Breakdown */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1 text-lg font-semibold text-green-600">
              <DollarSign className="w-5 h-5" />
              <span>Base Price: ${submission.quoted_price}</span>
            </div>
            {submission.estimated_hours && (
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{submission.estimated_hours} hours</span>
              </div>
            )}
          </div>
          
          {(submission.materials_cost || submission.travel_fee) && (
            <div className="space-y-1 text-sm">
              {submission.materials_cost && submission.materials_cost > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Package className="w-3 h-3 text-gray-500" />
                    <span>Materials:</span>
                  </div>
                  <span>${submission.materials_cost}</span>
                </div>
              )}
              {submission.travel_fee && submission.travel_fee > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Car className="w-3 h-3 text-gray-500" />
                    <span>Travel fee:</span>
                  </div>
                  <span>${submission.travel_fee}</span>
                </div>
              )}
              <hr className="my-1" />
              <div className="flex items-center justify-between font-medium">
                <span>Total Cost:</span>
                <span className="text-green-600">${totalCost}</span>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 mt-1 text-gray-500" />
            <div>
              <p className="text-sm text-gray-700 font-medium mb-1">Work Description:</p>
              <p className="text-sm text-gray-700">{submission.description}</p>
            </div>
          </div>
          
          {submission.availability_note && (
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <p className="text-sm text-gray-700 font-medium mb-1">Availability:</p>
                <p className="text-sm text-gray-700">{submission.availability_note}</p>
              </div>
            </div>
          )}

          {submission.materials_included && (
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-700 font-medium">
                Materials included in base price
              </span>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Submitted {new Date(submission.created_at).toLocaleDateString()} at{' '}
          {new Date(submission.created_at).toLocaleTimeString()}
        </div>

        {submission.status === 'pending' && !isAccepted && (
          <Button
            onClick={() => onAccept(submission.id)}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isAccepting}
          >
            {isAccepting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Accepting...
              </>
            ) : (
              'Accept Quote'
            )}
          </Button>
        )}

        {isAccepted && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Quote Accepted!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              A job has been created and the handyman will contact you soon.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
