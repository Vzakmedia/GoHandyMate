
import { useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { useHandymanData } from '@/hooks/useHandymanData';
import { ProfileSetupFlow } from './ProfileSetupFlow';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { AuthScreen } from '@/features/auth';
import { useNavigate } from 'react-router-dom';

export const ProfileSetupWrapper = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { data: handymanData, loading, error, refreshData } = useHandymanData();

  // Refresh data when component mounts to ensure latest state
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user, refreshData]);

  // Auto-refresh every 30 seconds to maintain real-time sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !loading) {
        refreshData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, loading, refreshData]);

  const handleContainerClick = (e: React.MouseEvent) => {
    // Prevent any click events from bubbling up that might cause navigation
    e.stopPropagation();
  };

  // Auth disabled - skip auth check

  if (profile?.user_role !== 'handyman') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-gray-600">This section is only available for handyman accounts.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading Profile Data</h3>
          <p className="text-gray-600">Setting up your profile dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div onClick={handleContainerClick} style={{ isolation: 'isolate' }}>
      <ProfileSetupFlow />
    </div>
  );
};
