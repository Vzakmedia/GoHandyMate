
import { useState } from 'react';
import { SignInForm } from './SignInForm';
import { DetailedSignUpForm } from './DetailedSignUpForm';
import { ArrowLeft, Users2, Hammer, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AuthScreenProps {
  onBack?: () => void;
  onSuccess?: () => void;
  isModal?: boolean;
  defaultIsSignUp?: boolean;
}

type UserRole = 'customer' | 'handyman';
// NOTE: 'contractor' pending. 'property_manager' moved to customer upgrade.

export const AuthScreen = ({ onBack, onSuccess, isModal = false, defaultIsSignUp = false }: AuthScreenProps) => {
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/', { replace: true });
    }
  };

  const roles = [
    { id: 'customer', label: 'Customer', icon: Users2, color: 'green' },
    { id: 'handyman', label: 'Handyman', icon: Hammer, color: 'emerald' },
    // CONTRACTOR - PENDING (commented out)
    // { id: 'contractor', label: 'Contractor', icon: TrendingUp, color: 'slate' },
    // PROPERTY_MANAGER - Moved to customer upgrade features
    // { id: 'property_manager', label: 'Manager', icon: Building, color: 'slate' },
  ];

  return (
    <div className={cn(
      "flex flex-col items-center w-full",
      !isModal && "min-h-screen bg-white p-4 sm:p-6 lg:p-12"
    )}>
      {/* Header Area */}
      <div className={cn(
        "w-full space-y-6 sm:space-y-8 mt-4 sm:mt-0",
        isModal ? "p-6 sm:p-12" : "max-w-2xl"
      )}>
        {!isModal && onBack && (
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-slate-500 hover:text-green-800 font-bold transition-all -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#FAFAF5] text-green-800 text-[10px] sm:text-[11px] font-black tracking-[0.15em] uppercase border border-[#EBEBE0] shadow-sm mb-1 sm:mb-2">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            {isSignUp ? 'Join the Community' : 'Welcome Back'}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A0A0A] tracking-tight">
            {isSignUp ? 'Create your account' : 'Sign in to GoHandyMate'}
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-sm mx-auto">
            {isSignUp
              ? 'Start your journey with us by choosing your role below'
              : 'Access your projects, bookings, and more'
            }
          </p>
        </div>

        {/* Mini Role Selection Buttons (Only for Sign Up) */}
        {isSignUp && (
          <div className="grid grid-cols-4 gap-2 sm:gap-3 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id as UserRole)}
                  className={cn(
                    "flex flex-col items-center gap-2 py-3 px-1 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-white text-green-800 shadow-md scale-100 border border-slate-100"
                      : "text-slate-400 hover:text-slate-600 hover:bg-white/50 scale-95"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    isActive ? "bg-green-50 text-green-600" : "bg-slate-100"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider">{role.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Auth Forms */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isSignUp ? (
            <DetailedSignUpForm
              onSwitchToSignIn={() => setIsSignUp(false)}
              onSuccess={onSuccess}
              initialRole={selectedRole}
              hideRoleSelector={true}
            />
          ) : (
            <SignInForm
              onSwitchToSignUp={() => setIsSignUp(true)}
              onSuccess={onSuccess}
            />
          )}
        </div>

        {!isModal && (
          <div className="pt-8 text-center border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400">
              "Join 50,000+ users building better homes together."
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
