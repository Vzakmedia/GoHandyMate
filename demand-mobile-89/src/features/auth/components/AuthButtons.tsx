
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, LogOut } from 'lucide-react';

export const AuthButtons = () => {
  const { signOut, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Failed to log out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2"
    >
      {isLoggingOut ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {isLoggingOut ? 'Logging out...' : 'Log Out'}
    </Button>
  );
};
