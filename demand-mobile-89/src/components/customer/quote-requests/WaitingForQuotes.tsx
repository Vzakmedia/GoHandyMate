
import { Clock } from 'lucide-react';

interface WaitingForQuotesProps {
  createdAt: string;
}

export const WaitingForQuotes = ({ createdAt }: WaitingForQuotesProps) => {
  return (
    <div className="text-center py-4">
      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-600">Waiting for handymen to submit quotes...</p>
      <p className="text-sm text-gray-500">
        Posted {new Date(createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};
