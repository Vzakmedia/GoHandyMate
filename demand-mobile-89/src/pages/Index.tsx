
import { useAuth } from '@/features/auth';
import { LoadingScreen } from "@/components/LoadingScreen";
import { MainAppLayout } from "@/components/MainAppLayout";
import { AuthenticationFlow } from "@/features/auth";
import { useAppState } from "@/hooks/useAppState";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  console.log('📄 Index: Component starting to render');
  
  const { user, loading } = useAuth();
  const appState = useAppState();
  const location = useLocation();
  
  // Handle navigation state from notifications
  useEffect(() => {
    if (location.state) {
      const state = location.state as { activeTab?: string; section?: string };
      const { activeTab } = state;
      if (activeTab && appState.setActiveTab) {
        console.log('📄 Index: Setting active tab from navigation state:', activeTab);
        appState.setActiveTab(activeTab);
      }
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state, appState]);

  console.log('📄 Index: Auth state - loading:', loading, 'user:', !!user);
  console.log('📄 Index: App state:', {
    userRole: appState.userRole,
    isAuthenticated: appState.isAuthenticated,
    showWelcome: appState.showWelcome,
    showAuth: appState.showAuth,
    loading: appState.loading
  });

  // Show loading screen while initializing
  if (loading || appState.loading) {
    console.log('🔄 Index: Showing loading screen');
    return <LoadingScreen />;
  }

  // Define mock tasks for the main app
  const mockTasks = [
    {
      id: 1,
      title: "Fix leaky faucet",
      description: "Kitchen faucet needs repair",
      category: "Plumbing",
      price: 85,
      location: "Downtown",
      timeAgo: "2 hours ago",
      taskerCount: 12,
      urgency: "Medium"
    }
  ];

  // Safety check for app state
  if (!appState.userRole && !appState.showWelcome) {
    console.log('⚠️ Index: Invalid app state, showing auth flow');
    return (
      <AuthenticationFlow
        showWelcome={true}
        showAuth={false}
        onRoleSelect={appState.handleRoleSelect}
        onContinueAsGuest={appState.handleContinueAsGuest}
        onBackToWelcome={appState.handleBackToWelcome}
      />
    );
  }

  // If we have a user role and don't need auth or welcome, show main app
  if (appState.userRole && !appState.showWelcome && !appState.showAuth) {
    const isUserAuthenticated = !!user;
    console.log(isUserAuthenticated ? '✅ Index: User authenticated, showing main app' : '👤 Index: Guest mode, showing main app');
    
    return (
      <MainAppLayout
        userRole={appState.userRole}
        isAuthenticated={isUserAuthenticated}
        user={user}
        activeTab={appState.activeTab}
        onTabChange={appState.setActiveTab}
        selectedCategory={appState.selectedCategory}
        setSelectedCategory={appState.setSelectedCategory}
        mockTasks={mockTasks}
        onChangeRole={appState.profile?.user_role === 'admin' ? appState.handleChangeRole : undefined}
        showWelcome={appState.showWelcome}
      />
    );
  }

  // Show authentication flow for users who haven't selected a role or clicked change role
  console.log('❌ Index: No role selected or showing welcome, showing auth flow');
  
  return (
    <AuthenticationFlow
      showWelcome={appState.showWelcome}
      showAuth={appState.showAuth}
      onRoleSelect={appState.handleRoleSelect}
      onContinueAsGuest={appState.handleContinueAsGuest}
      onBackToWelcome={appState.handleBackToWelcome}
    />
  );
};

export default Index;
