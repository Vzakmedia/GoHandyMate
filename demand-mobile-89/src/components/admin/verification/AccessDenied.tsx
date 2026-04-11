
import React from 'react';
import { Shield } from 'lucide-react';

interface AccessDeniedProps {
  userEmail?: string;
}

export const AccessDenied = ({ userEmail }: AccessDeniedProps) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">You don't have permission to access the admin verification panel.</p>
        <p className="text-xs text-gray-400 mt-2">
          Current user: {userEmail || 'Not signed in'}
        </p>
      </div>
    </div>
  );
};
