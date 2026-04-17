
import { AuthScreen } from "./AuthScreen";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultIsSignUp?: boolean;
  defaultRole?: 'customer' | 'handyman';
}

export const AuthModal = ({ isOpen, onClose, onSuccess, defaultIsSignUp = false, defaultRole = 'customer' }: AuthModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBackToSelection = () => {
    onClose();
    navigate('/', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Premium Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <AuthScreen
          onBack={handleBackToSelection}
          onSuccess={onSuccess}
          isModal={true}
          defaultIsSignUp={defaultIsSignUp}
          defaultRole={defaultRole}
        />
      </div>
    </div>
  );
};
