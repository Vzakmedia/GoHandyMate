
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddressInput } from '@/components/ui/address-input';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onSuccess?: () => void;
}

export const SignUpForm = ({ onSwitchToSignIn, onSuccess }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleAddressSelect = (selectedAddress: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
  }) => {
    setAddress(selectedAddress.formatted_address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // Close the modal after successful sign up
      if (onSuccess) {
        onSuccess();
      }
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-800">Join GoHandyMate</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
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
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
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
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
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
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <AddressInput
              value={address}
              onChange={setAddress}
              onAddressSelect={handleAddressSelect}
              placeholder="Enter your address..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userRole">I am a...</Label>
            <Select value={userRole} onValueChange={setUserRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer - I need services</SelectItem>
                <SelectItem value="handyman">Handyman - I provide quick fixes</SelectItem>
              </SelectContent>
            </Select>
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
              'Create Account'
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
