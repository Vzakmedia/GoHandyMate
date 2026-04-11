
import { AuthScreen } from "@/features/auth";
import { useNavigate } from "react-router-dom";

interface HeaderAuthModalProps {
  showAuthModal: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const HeaderAuthModal = ({ showAuthModal, onClose, onSuccess }: HeaderAuthModalProps) => {
  const navigate = useNavigate();
  
  if (!showAuthModal) return null;

  const handleBackToSelection = () => {
    onClose();
    navigate('/', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
        <AuthScreen 
          onBack={handleBackToSelection} 
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};
