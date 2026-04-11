
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/features/auth';

interface AccountVerificationContextType {
  canAccessRole: (role: string) => boolean;
  accountStatus: 'pending' | 'active' | 'rejected' | 'suspended';
  isPendingVerification: boolean;
  isRejected: boolean;
  rejectionReason?: string;
}

const AccountVerificationContext = createContext<AccountVerificationContextType | undefined>(undefined);

export const AccountVerificationProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuth();

  const accountStatus = (profile?.account_status as 'pending' | 'active' | 'rejected' | 'suspended') || 'pending';
  const isPendingVerification = accountStatus === 'pending';
  const isRejected = accountStatus === 'rejected';
  const rejectionReason = profile?.rejection_reason;

  const canAccessRole = (role: string) => {
    if (!profile) return true; // Auth disabled - allow all access
    
    // Property managers are automatically active
    if (role === 'property_manager') return true;
    
    // Customers don't need verification
    if (role === 'customer') return true;
    
    // For handyman and contractor roles, check both account status and subscription status
    if (role === 'handyman' || role === 'contractor') {
      return profile.account_status === 'active' && 
             (profile.subscription_status === 'active' || profile.subscription_status === 'trialing');
    }
    
    return false;
  };

  return (
    <AccountVerificationContext.Provider value={{
      canAccessRole,
      accountStatus,
      isPendingVerification,
      isRejected,
      rejectionReason
    }}>
      {children}
    </AccountVerificationContext.Provider>
  );
};

export const useAccountVerification = () => {
  const context = useContext(AccountVerificationContext);
  if (context === undefined) {
    throw new Error('useAccountVerification must be used within an AccountVerificationProvider');
  }
  return context;
};
