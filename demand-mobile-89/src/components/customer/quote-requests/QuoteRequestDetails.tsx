
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { QuoteWithSubmissions } from './types';

interface QuoteRequestDetailsProps {
  request: QuoteWithSubmissions;
}

export const QuoteRequestDetails = ({ request }: QuoteRequestDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-400" />
        <span>{request.location}</span>
      </div>
      {request.preferred_date && (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(request.preferred_date).toLocaleDateString()}</span>
        </div>
      )}
      {request.budget_range && (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span>Budget: {request.budget_range}</span>
        </div>
      )}
    </div>
  );
};
