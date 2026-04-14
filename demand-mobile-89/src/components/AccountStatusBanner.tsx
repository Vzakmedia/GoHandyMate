
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAccountVerification } from '@/components/AccountVerificationProvider';
import { useAuth } from '@/features/auth';

export const AccountStatusBanner = () => {
  const { profile, signOut } = useAuth();
  const { accountStatus, isPendingVerification, isRejected, rejectionReason } = useAccountVerification();

  // Only show banner for providers with non-active status
  if (!profile || profile.user_role !== 'provider' || accountStatus === 'active') {
    return null;
  }

  const getStatusConfig = () => {
    switch (accountStatus) {
      case 'pending':
        return {
          icon: Clock,
          color: 'border-yellow-200 bg-yellow-50',
          badgeVariant: 'secondary' as const,
          title: 'Account Pending Verification',
          description: `Your ${profile.user_role} account is currently pending admin approval. You'll receive an email once your account is verified.`
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'border-red-200 bg-red-50',
          badgeVariant: 'destructive' as const,
          title: 'Account Rejected',
          description: rejectionReason || 'Your account application has been rejected. Please contact support for more information.'
        };
      case 'suspended':
        return {
          icon: AlertTriangle,
          color: 'border-orange-200 bg-orange-50',
          badgeVariant: 'destructive' as const,
          title: 'Account Suspended',
          description: 'Your account has been suspended. Please contact support for assistance.'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Alert className={`mb-6 ${config.color}`}>
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 mt-0.5 text-current" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-sm">{config.title}</h3>
            <Badge variant={config.badgeVariant} className="text-xs">
              {accountStatus.charAt(0).toUpperCase() + accountStatus.slice(1)}
            </Badge>
          </div>
          <AlertDescription className="text-sm">
            {config.description}
          </AlertDescription>
          {isRejected && (
            <div className="mt-3 flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};
