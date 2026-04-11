
import { Button } from '@/components/ui/button';

interface ProfessionalsPopupFooterProps {
  loading: boolean;
  professionalCount: number;
  serviceName: string;
}

export const ProfessionalsPopupFooter = ({
  loading,
  professionalCount,
  serviceName
}: ProfessionalsPopupFooterProps) => {
  if (loading || professionalCount === 0) {
    return null;
  }

  return (
    <div className="p-6 border-t bg-gray-50">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {professionalCount} available professionals for {serviceName}
        </p>
        <Button 
          variant="outline"
          onClick={() => {
            window.open(`/professionals?search=${encodeURIComponent(serviceName)}`, '_blank');
          }}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          View All Professionals
        </Button>
      </div>
    </div>
  );
};
