
import React from 'react';
import { Shield } from 'lucide-react';

interface AdminAccessControlProps {
  user: any;
  authLoading: boolean;
  onBackToRoles: () => void;
}

export const AdminAccessControl = ({ user, authLoading, onBackToRoles }: AdminAccessControlProps) => {
  // Check if user is admin - temporarily including support@gohandymate.com for testing
  const isAdmin = user?.email === 'admin@gohandymate.com' || 
                  user?.email?.endsWith('@admin.gohandymate.com') ||
                  user?.email === 'support@gohandymate.com';

  console.log('AdminAccessControl: Admin check', { 
    userEmail: user?.email,
    isAdmin,
    authLoading,
    userExists: !!user
  });

  // Show loading while auth is loading
  if (authLoading) {
    console.log('AdminAccessControl: Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin backend...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    console.log('AdminAccessControl: Access denied', { 
      userEmail: user?.email,
      isAdmin,
      userExists: !!user
    });
    
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin backend.</p>
          <p className="text-sm text-gray-500">
            Contact the system administrator if you believe this is an error.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Current user: {user?.email || 'Not signed in'}
          </p>
          <div className="mt-4">
            <button
              onClick={onBackToRoles}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin access granted, render nothing (let parent component continue)
  return null;
};
