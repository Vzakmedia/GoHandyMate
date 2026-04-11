
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Users, ArrowRight } from "lucide-react";

interface ProfessionalTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: 'handyman' | 'contractor') => void;
}

export const ProfessionalTypeModal = ({ open, onClose, onSelectType }: ProfessionalTypeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            What type of professional do you need?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            <Button
              onClick={() => onSelectType('handyman')}
              variant="outline"
              size="lg"
              className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-green-50 hover:border-green-500 group"
            >
              <div className="bg-green-100 rounded-full p-3 group-hover:bg-green-200 transition-colors">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-800">Handyman</h3>
                <p className="text-sm text-gray-600 mt-1">
                  For general repairs, maintenance, and small jobs
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <Button
              onClick={() => onSelectType('contractor')}
              variant="outline"
              size="lg"
              className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-blue-50 hover:border-blue-500 group"
            >
              <div className="bg-blue-100 rounded-full p-3 group-hover:bg-blue-200 transition-colors">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-800">Contractor</h3>
                <p className="text-sm text-gray-600 mt-1">
                  For specialized projects and larger renovations
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
