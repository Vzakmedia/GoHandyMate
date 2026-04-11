
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSecureAuth } from '../hooks/useSecureAuth';
import { Loader2, Mail, Lock, User, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signUpSchema } from '@/lib/validation';

import { z } from 'zod';

interface SecureSignUpFormProps {
  onSwitchToSignIn: () => void;
}

export const SecureSignUpForm = ({ onSwitchToSignIn }: SecureSignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { signUp, isRateLimited } = useSecureAuth();
  const { toast } = useToast();

  const validateForm = () => {
    try {
      signUpSchema.parse({ email, password, fullName, userRole });
      setValidationErrors({});
      return true;
    } catch (error) {
      const errors: Record<string, string> = {};
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          errors[err.path[0] as string] = err.message;
        });
      }
      setValidationErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRateLimited) {
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, fullName, userRole);

    if (error) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
    }

    setIsLoading(false);
  };

  if (isRateLimited) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Too many signup attempts. Please try again in 15 minutes.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-800">Join GoHandyMate</CardTitle>
        <CardDescription>Create your secure account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (validationErrors.fullName) {
                    setValidationErrors(prev => ({ ...prev, fullName: '' }));
                  }
                }}
                className={`pl-10 ${validationErrors.fullName ? 'border-red-500' : ''}`}
                required
                autoComplete="name"
              />
            </div>
            {validationErrors.fullName && (
              <p className="text-sm text-red-600">{validationErrors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                className={`pl-10 ${validationErrors.email ? 'border-red-500' : ''}`}
                required
                autoComplete="email"
              />
            </div>
            {validationErrors.email && (
              <p className="text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                className={`pl-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-600">{validationErrors.password}</p>
            )}
            <p className="text-xs text-gray-500">
              Password must contain at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userRole">I am a...</Label>
            <Select value={userRole} onValueChange={(value) => {
              setUserRole(value);
              if (validationErrors.userRole) {
                setValidationErrors(prev => ({ ...prev, userRole: '' }));
              }
            }} required>
              <SelectTrigger className={validationErrors.userRole ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer - I need services</SelectItem>
                <SelectItem value="handyman">Handyman - I provide quick fixes</SelectItem>
                <SelectItem value="contractor">Licensed Contractor - I handle large projects</SelectItem>
                <SelectItem value="property_manager">Property Manager - I manage properties</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.userRole && (
              <p className="text-sm text-red-600">{validationErrors.userRole}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading || !userRole}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Secure Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToSignIn}
              className="text-green-600 hover:text-green-700 font-medium underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
