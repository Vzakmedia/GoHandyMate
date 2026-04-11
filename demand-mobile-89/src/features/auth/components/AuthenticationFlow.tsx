
import { ReactNode } from 'react';
import { WelcomeScreen } from "./WelcomeScreen";
import { AuthScreen } from "./AuthScreen";

interface AuthenticationFlowProps {
  showWelcome: boolean;
  showAuth: boolean;
  onRoleSelect: (role: 'customer' | 'handyman' | 'contractor' | 'property_manager') => void;
  onContinueAsGuest: () => void;
  onBackToWelcome: () => void;
  children?: ReactNode;
}

export const AuthenticationFlow = ({
  showWelcome,
  showAuth,
  onRoleSelect,
  onContinueAsGuest,
  onBackToWelcome,
  children
}: AuthenticationFlowProps) => {
  // Show welcome screen for users who haven't chosen their path yet
  if (showWelcome) {
    return (
      <WelcomeScreen 
        onRoleSelect={onRoleSelect}
        onContinueAsGuest={onContinueAsGuest}
      />
    );
  }

  // Show auth screen when user has selected a role but isn't authenticated
  if (showAuth) {
    return (
      <AuthScreen 
        onBack={onBackToWelcome}
      />
    );
  }

  // Render children (main app) when authenticated or guest
  return <>{children}</>;
};
