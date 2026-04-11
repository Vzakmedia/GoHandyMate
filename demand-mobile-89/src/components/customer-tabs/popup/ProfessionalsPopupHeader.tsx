
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users } from 'lucide-react';

interface ProfessionalsPopupHeaderProps {
  serviceName: string;
  loading: boolean;
  professionalCount: number;
  onClose: () => void;
}

export const ProfessionalsPopupHeader = ({
  serviceName,
  loading,
  professionalCount,
  onClose
}: ProfessionalsPopupHeaderProps) => {
  return (
    <DialogHeader className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
      <DialogTitle className="flex items-center gap-3">
        <div className="p-3 bg-green-600 rounded-xl shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {serviceName} Professionals
          </h2>
          <p className="text-gray-600">
            {loading ? 'Finding available professionals...' : 
             `${professionalCount} professionals available`}
          </p>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
};
