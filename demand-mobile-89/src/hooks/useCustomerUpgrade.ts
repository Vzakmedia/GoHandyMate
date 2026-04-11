
import { useAuth } from '@/features/auth';

/**
 * Hook to check if the current customer has an active upgrade (subscription).
 * Upgraded customers get access to Property Manager features within the customer dashboard.
 */
export const useCustomerUpgrade = () => {
    const { profile } = useAuth();

    const isUpgraded =
        profile?.subscription_status === 'active' ||
        profile?.subscription_status === 'trial';

    const subscriptionStatus = profile?.subscription_status || 'inactive';
    const subscriptionPlan = profile?.subscription_plan || null;

    return {
        isUpgraded,
        subscriptionStatus,
        subscriptionPlan,
    };
};
