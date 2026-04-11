
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from '@/features/auth';

export const useAppState = () => {
  const { userRole, setUserRole, isAuthenticated, setIsAuthenticated } = useUserRole();
  const { user, profile, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Debug logging removed for production
  if (process.env.NODE_ENV === 'development') {
    console.log('useAppState DEBUG:', {
      loading,
      userExists: !!user,
      profileExists: !!profile,
      userRole,
      isAuthenticated,
      showWelcome,
      showAuth,
      isInitialized
    });
  }

  // Initialize app state - bypass auth, go straight to app
  useEffect(() => {
    // ALWAYS force authenticated state for screen exploration
    setIsAuthenticated(true);
    // Coerce legacy/removed roles to 'customer' for compatibility
    const dbRole = profile?.user_role;
    const resolvedRole: 'customer' | 'handyman' =
      dbRole === 'handyman' ? 'handyman' : 'customer';
    // NOTE: 'contractor' (pending) and 'property_manager' (now in customer upgrade) are coerced to 'customer'
    setUserRole(resolvedRole);
    setShowWelcome(false);
    setShowAuth(false);
    setIsInitialized(true);

    // Default to home tab
    setActiveTab('home');
  }, [profile, setUserRole, setIsAuthenticated]);

  // Note: Removed fallback role setting - users must select their role first

  const handleRoleSelect = (role: 'customer' | 'handyman') => {
    // NOTE: 'contractor' pending. 'property_manager' merged into customer upgrade features.
    setUserRole(role);
    setShowWelcome(false);
    setShowAuth(false);
    if (role !== 'customer') {
      setActiveTab('dashboard');
    }
  };

  const handleContinueAsGuest = () => {
    // Navigate to the onboarding page instead of directly setting role
    window.location.href = '/onboarding';
  };

  const handleBackToWelcome = () => {
    setShowAuth(false);
    setShowWelcome(true);
    setUserRole(null);
    setActiveTab('home');
  };

  const handleChangeRole = () => {
    setShowWelcome(true);
    setShowAuth(false);
    setUserRole(null);
    setActiveTab('home');
  };

  return {
    user,
    profile,
    loading: loading || !isInitialized,
    userRole,
    isAuthenticated,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    setActiveTab,
    showWelcome,
    showAuth,
    handleRoleSelect,
    handleContinueAsGuest,
    handleBackToWelcome,
    handleChangeRole
  };
};
