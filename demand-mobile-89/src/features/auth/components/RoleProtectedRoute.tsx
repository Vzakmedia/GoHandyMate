
import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { AuthScreen } from './AuthScreen';

interface RoleProtectedRouteProps {
  children: ReactNode;
  requiredRole: 'customer' | 'provider' | 'admin';
  onBackToHome?: () => void;
}

export const RoleProtectedRoute = ({
  children,
  requiredRole,
  onBackToHome,
}: RoleProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (profile && profile.user_role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto text-destructive mb-2" />
            <CardTitle>Access Restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This area is for <span className="font-semibold capitalize">{requiredRole.replace('_', ' ')}</span> accounts only.
            </p>
            {onBackToHome && (
              <Button variant="outline" onClick={onBackToHome}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
