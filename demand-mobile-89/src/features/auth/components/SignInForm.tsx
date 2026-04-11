
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSuccess?: () => void;
}

export const SignInForm = ({ onSwitchToSignUp, onSuccess }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      if (onSuccess) {
        onSuccess();
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-12 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:border-green-200 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 pl-12 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:border-green-200 transition-all font-medium"
                required
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-green-800 hover:bg-green-900 text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-lg shadow-green-900/10 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      <div className="flex flex-col items-center space-y-4">
        <div className="h-px w-24 bg-slate-100" />
        <p className="text-sm font-medium text-slate-500">
          New to GoHandyMate?{' '}
          <button
            onClick={onSwitchToSignUp}
            className="text-green-600 hover:text-green-700 font-black"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};
