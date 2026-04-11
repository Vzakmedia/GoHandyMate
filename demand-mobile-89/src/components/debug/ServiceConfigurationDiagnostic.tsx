
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ServiceConfigurationDiagnosticProps {
  userId: string;
}

export const ServiceConfigurationDiagnostic = ({ userId }: ServiceConfigurationDiagnosticProps) => {
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnosticData = async () => {
      try {
        console.log('ServiceConfigurationDiagnostic: Fetching data for user:', userId);
        
        // Fetch all data with detailed logging
        const [servicePricingResult, skillRatesResult, profileResult] = await Promise.allSettled([
          supabase
            .from('handyman_service_pricing')
            .select('*')
            .eq('user_id', userId),
          
          supabase
            .from('handyman_skill_rates')
            .select('*')
            .eq('user_id', userId),
            
          supabase
            .from('profiles')
            .select('full_name, user_role, account_status, subscription_status')
            .eq('id', userId)
            .single()
        ]);

        const diagnosticInfo = {
          userId,
          servicePricing: {
            status: servicePricingResult.status,
            data: servicePricingResult.status === 'fulfilled' ? servicePricingResult.value.data : null,
            error: servicePricingResult.status === 'rejected' ? servicePricingResult.reason : null,
            count: servicePricingResult.status === 'fulfilled' ? servicePricingResult.value.data?.length || 0 : 0
          },
          skillRates: {
            status: skillRatesResult.status,
            data: skillRatesResult.status === 'fulfilled' ? skillRatesResult.value.data : null,
            error: skillRatesResult.status === 'rejected' ? skillRatesResult.reason : null,
            count: skillRatesResult.status === 'fulfilled' ? skillRatesResult.value.data?.length || 0 : 0
          },
          profile: {
            status: profileResult.status,
            data: profileResult.status === 'fulfilled' ? profileResult.value.data : null,
            error: profileResult.status === 'rejected' ? profileResult.reason : null
          }
        };

        console.log('ServiceConfigurationDiagnostic: Diagnostic data:', diagnosticInfo);
        setDiagnosticData(diagnosticInfo);
        
      } catch (error) {
        console.error('ServiceConfigurationDiagnostic: Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosticData();
  }, [userId]);

  if (loading) {
    return (
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
            Service Configuration Diagnostic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading diagnostic information...</p>
        </CardContent>
      </Card>
    );
  }

  if (!diagnosticData) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <XCircle className="w-5 h-5 mr-2 text-red-600" />
            Diagnostic Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load diagnostic information.</p>
        </CardContent>
      </Card>
    );
  }

  const { servicePricing, skillRates, profile } = diagnosticData;
  const activeServicePricing = servicePricing.data?.filter((s: any) => s.is_active) || [];
  const activeSkillRates = skillRates.data?.filter((s: any) => s.is_active) || [];
  const totalActiveServices = activeServicePricing.length + activeSkillRates.length;

  return (
    <div className="space-y-4">
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
            Service Configuration Diagnostic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Information */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Profile Information</h3>
            {profile.status === 'fulfilled' && profile.data ? (
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {profile.data.full_name}</p>
                <p><strong>Role:</strong> {profile.data.user_role}</p>
                <p><strong>Account Status:</strong> <Badge variant={profile.data.account_status === 'active' ? 'default' : 'destructive'}>{profile.data.account_status}</Badge></p>
                <p><strong>Subscription:</strong> <Badge variant={profile.data.subscription_status === 'active' ? 'default' : 'secondary'}>{profile.data.subscription_status}</Badge></p>
              </div>
            ) : (
              <p className="text-red-600">Failed to load profile: {profile.error?.message}</p>
            )}
          </div>

          {/* Service Pricing Status */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              {servicePricing.status === 'fulfilled' ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 mr-2 text-red-600" />
              )}
              Service Pricing Configuration
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Total Records:</strong> {servicePricing.count}</p>
              <p><strong>Active Services:</strong> {activeServicePricing.length}</p>
              {servicePricing.status === 'fulfilled' && servicePricing.data?.length > 0 && (
                <div>
                  <p className="font-medium">Configured Services:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    {servicePricing.data.map((service: any, index: number) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>Category: {service.category_id}{service.subcategory_id ? ` > ${service.subcategory_id}` : ''}</span>
                        <Badge variant={service.is_active ? 'default' : 'outline'}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {servicePricing.error && (
                <p className="text-red-600">Error: {servicePricing.error.message}</p>
              )}
            </div>
          </div>

          {/* Skill Rates Status */}
          <div className="p-3 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              {skillRates.status === 'fulfilled' ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 mr-2 text-red-600" />
              )}
              Skill Rates Configuration
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Total Records:</strong> {skillRates.count}</p>
              <p><strong>Active Skills:</strong> {activeSkillRates.length}</p>
              {skillRates.status === 'fulfilled' && skillRates.data?.length > 0 && (
                <div>
                  <p className="font-medium">Configured Skills:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    {skillRates.data.map((skill: any, index: number) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{skill.skill_name} (${skill.hourly_rate}/hr)</span>
                        <Badge variant={skill.is_active ? 'default' : 'outline'}>
                          {skill.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {skillRates.error && (
                <p className="text-red-600">Error: {skillRates.error.message}</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className={`p-3 rounded-lg ${totalActiveServices > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <h3 className="font-semibold mb-2 flex items-center">
              {totalActiveServices > 0 ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 mr-2 text-red-600" />
              )}
              Summary
            </h3>
            <div className="space-y-1 text-sm">
              <p><strong>Total Active Services:</strong> {totalActiveServices}</p>
              {totalActiveServices === 0 && (
                <p className="text-red-600 font-medium">
                  ⚠️ No active services found. This explains why the profile shows "No services configured".
                </p>
              )}
              {totalActiveServices > 0 && (
                <p className="text-green-600 font-medium">
                  ✅ Services are configured and should be visible on the profile.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
