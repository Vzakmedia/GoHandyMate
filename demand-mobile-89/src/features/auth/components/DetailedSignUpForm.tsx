
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth';
import { Loader2, ArrowRight, Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

import { BasicInfoSection } from './signup/BasicInfoSection';
import { HandymanRequirementsSection } from './signup/HandymanRequirementsSection';
import { SignUpFormData, HandymanFormData } from './signup/types';
import { validateBasicForm, validateHandymanForm } from './signup/utils/validation';

interface DetailedSignUpFormProps {
  onSwitchToSignIn: () => void;
  onSuccess?: () => void;
  initialRole?: string;
  hideRoleSelector?: boolean;
}

export const DetailedSignUpForm = ({
  onSwitchToSignIn,
  onSuccess,
  initialRole = '',
  hideRoleSelector = false
}: DetailedSignUpFormProps) => {
  const [basicData, setBasicData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    userRole: initialRole,
  });

  // Sync role when initialRole prop changes
  useEffect(() => {
    if (initialRole) {
      setBasicData(prev => ({ ...prev, userRole: initialRole }));
    }
  }, [initialRole]);

  const [handymanData, setHandymanData] = useState<HandymanFormData>({
    ssn: '',
    validIdFile: null,
    experienceYears: '',
    skills: [],
    newSkill: '',
    hourlyRate: '',
    bio: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (file: File | null, type: 'validId' | 'license' | 'insurance') => {
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    if (type === 'validId') {
      setHandymanData(prev => ({ ...prev, validIdFile: file }));
    }
  };

  const handleHandymanFileUpload = (file: File | null) => {
    handleFileUpload(file, 'validId');
  };

  const updateBasicData = (field: keyof SignUpFormData, value: string) => {
    setBasicData(prev => ({ ...prev, [field]: value }));
  };

  const updateHandymanData = (field: keyof HandymanFormData, value: string | string[] | File | null) => {
    setHandymanData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const basicError = validateBasicForm(basicData);
    if (basicError) {
      toast({
        title: "Validation Error",
        description: basicError,
        variant: "destructive",
      });
      return false;
    }

    if (basicData.userRole === 'handyman') {
      const handymanError = validateHandymanForm(handymanData);
      if (handymanError) {
        toast({
          title: "Missing handyman requirements",
          description: handymanError,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data, error } = await signUp(basicData.email, basicData.password, basicData.fullName, basicData.userRole);

      console.log('[SignUp] response data:', JSON.stringify({ user: data?.user?.id, session: !!data?.session, identities: data?.user?.identities?.length, email_confirmed_at: data?.user?.email_confirmed_at }));
      console.log('[SignUp] error:', error);

      if (error) {
        toast({
          title: "Error creating account",
          description: error.message,
          variant: "destructive",
        });
      } else if (data?.session) {
        // Remote project has email confirmations disabled — user is auto-confirmed
        toast({
          title: "Account created!",
          description: "Welcome to the platform.",
        });
        if (onSuccess) onSuccess(); else navigate('/app', { replace: true });
      } else if (data?.user?.identities?.length === 0) {
        // Email already registered — Supabase silently returns a fake user to prevent enumeration
        toast({
          title: "Email already in use",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        // Email confirmation required — OTP sent
        setPendingEmail(basicData.email);
        setStep('otp');
        toast({
          title: "Check your email",
          description: "We sent a 6-digit verification code to " + basicData.email,
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Unexpected error",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast({ title: "Invalid code", description: "Please enter the 6-digit code.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ email: pendingEmail, token: otpCode, type: 'signup' });
      if (error) {
        toast({ title: "Verification failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Email verified!", description: "Your account is now active." });
        if (onSuccess) onSuccess(); else navigate('/app', { replace: true });
      }
    } catch (err) {
      toast({ title: "Unexpected error", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="w-full mx-auto space-y-6">
        <button
          type="button"
          onClick={() => { setStep('form'); setOtpCode(''); }}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Mail className="w-12 h-12 text-green-700" />
          </div>
          <h2 className="text-xl font-black text-slate-800">Verify your email</h2>
          <p className="text-sm text-slate-500">
            Enter the 6-digit code sent to <span className="font-semibold text-slate-700">{pendingEmail}</span>
          </p>
        </div>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
            className="text-center text-2xl tracking-[0.5em] h-14 font-bold"
            autoFocus
          />
          <Button
            type="submit"
            disabled={isLoading || otpCode.length !== 6}
            className="w-full h-14 bg-green-800 hover:bg-green-900 text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Continue'}
          </Button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Didn't receive a code?{' '}
          <button
            type="button"
            className="text-green-600 hover:text-green-700 font-black"
            onClick={async () => {
              await supabase.auth.resend({ type: 'signup', email: pendingEmail });
              toast({ title: "Code resent", description: "Check your inbox again." });
            }}
          >
            Resend
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <BasicInfoSection
          data={basicData}
          onUpdate={updateBasicData}
          hideRoleSelector={hideRoleSelector}
        />

        {/* Handyman Specific Fields */}
        {basicData.userRole === 'handyman' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <HandymanRequirementsSection
              data={handymanData}
              onUpdate={updateHandymanData}
              onFileUpload={handleHandymanFileUpload}
            />
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !basicData.userRole}
          className="w-full h-14 bg-green-800 hover:bg-green-900 text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Join as {
                basicData.userRole === 'handyman' ? 'Handyman' :
                  basicData.userRole === 'customer' ? 'Customer' : 'Member'
              }
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      <div className="flex flex-col items-center space-y-4">
        <div className="h-px w-24 bg-slate-100" />
        <p className="text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onSwitchToSignIn}
            className="text-green-600 hover:text-green-700 font-black"
          >
            Sign in
          </button>
        </p>
      </div>

      {basicData.userRole === 'handyman' && (
        <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
          <p className="text-[11px] font-bold text-orange-800/70 leading-relaxed uppercase tracking-wider text-center">
            Verification required: 1-3 business days
          </p>
        </div>
      )}
    </div>
  );
};
