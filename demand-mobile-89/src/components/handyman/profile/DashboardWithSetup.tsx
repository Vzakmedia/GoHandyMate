
import { useHandymanData } from '@/hooks/useHandymanData';
import { ProfileSetupWrapper } from './ProfileSetupWrapper';
import { HandymanMetrics } from '@/components/HandymanMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const DashboardWithSetup = () => {
  const { data: handymanData, loading } = useHandymanData();

  // Calculate setup completion
  const isSetupComplete = () => {
    if (!handymanData) return false;
    
    const hasSkills = handymanData.skillRates?.length > 0;
    const hasServicePricing = handymanData.servicePricing?.length > 0;
    const hasWorkAreas = handymanData.workAreas?.length > 0;
    
    return hasSkills && hasServicePricing && hasWorkAreas;
  };

  const setupComplete = isSetupComplete();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Setup Status Banner */}
      <Card className={setupComplete ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            {setupComplete ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            )}
            <div className="flex-1">
              <h3 className={`font-semibold ${setupComplete ? 'text-green-800' : 'text-yellow-800'}`}>
                {setupComplete ? 'Profile Setup Complete!' : 'Complete Your Profile Setup'}
              </h3>
              <p className={`text-sm ${setupComplete ? 'text-green-700' : 'text-yellow-700'}`}>
                {setupComplete 
                  ? 'Your profile is ready to receive jobs and all metrics are updating in real-time.'
                  : 'Add your skills and service pricing to start receiving jobs and see live data in your dashboard.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show metrics if setup is complete, otherwise show setup flow */}
      {setupComplete ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <HandymanMetrics />
          
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {handymanData.skillRates?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {handymanData.servicePricing?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Service Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {handymanData.workAreas?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Work Areas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {handymanData.servicePricing?.filter(s => s.is_active)?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active Services</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <ProfileSetupWrapper />
      )}
    </div>
  );
};
