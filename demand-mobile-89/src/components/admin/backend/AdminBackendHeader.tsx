
import React from 'react';
import { BackButton } from '@/components/navigation/BackButton';
import { Shield } from 'lucide-react';

interface AdminBackendHeaderProps {
  onBackToRoles: () => void;
}

export const AdminBackendHeader = ({ onBackToRoles }: AdminBackendHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <BackButton 
          onClick={onBackToRoles}
          label="Back to Roles"
        />
        <div>
          <h1 className="text-3xl font-bold">Admin Backend</h1>
          <p className="text-gray-600">Comprehensive system administration and user management</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Shield className="h-5 w-5 text-green-600" />
        <span className="text-sm font-medium text-green-600">Admin Access</span>
      </div>
    </div>
  );
};
