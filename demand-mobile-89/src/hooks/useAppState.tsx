
import { useState, useEffect, useRef } from "react";
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
  const didInitRef = useRef(false);

  // Initialize app state based on auth profile
  useEffect(() => {
    if (loading) return; // Wait for auth to fully resolve

    setIsAuthenticated(!!user);
    const dbRole = profile?.user_role;
    
    // Only auto-resolve role if it hasn't been set yet
    if (!userRole && dbRole) {
      // DB stores 'handyman' (from signup form); also handle legacy 'provider' value.
      const resolvedRole: 'customer' | 'handyman' | 'admin' =
        dbRole === 'handyman' || dbRole === 'provider' ? 'handyman' :
        dbRole === 'admin' ? 'admin' :
        'customer';
      setUserRole(resolvedRole);
      setShowWelcome(false);
      setShowAuth(false);
    }
    
    setIsInitialized(true);

    // Only set the default tab on first initialization
    if (!didInitRef.current && dbRole) {
      didInitRef.current = true;
      const initialRole = dbRole === 'handyman' || dbRole === 'provider' ? 'handyman' :
                         dbRole === 'admin' ? 'admin' : 'customer';
      setActiveTab(initialRole !== 'customer' ? 'dashboard' : 'home');
    }
  }, [user, profile, loading, userRole]);

  // Note: Removed fallback role setting - users must select their role first

  const handleRoleSelect = (role: 'customer' | 'handyman' | 'provider' | 'admin') => {
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
