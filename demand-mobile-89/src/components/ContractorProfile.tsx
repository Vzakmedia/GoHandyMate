import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';
import { useContractorSync } from '@/hooks/useContractorSync';
import { useUnifiedHandymanMetrics } from '@/hooks/useUnifiedHandymanMetrics';
import { AvailabilityManager } from './contractor/AvailabilityManager';
import { TeamManagement } from './contractor/TeamManagement';
import { ProfileHeader } from './contractor/profile/ProfileHeader';
import { BusinessInformation } from './contractor/profile/BusinessInformation';
import { ServicesOffered } from './contractor/profile/ServicesOffered';
import { LicensesCertifications } from './contractor/profile/LicensesCertifications';
import { ServiceAreas } from './contractor/profile/ServiceAreas';
import { QuickActions } from './contractor/profile/QuickActions';
import { ContractorErrorBoundary } from './contractor/ErrorBoundary';
import { UnifiedNotificationSettings } from '@/components/notifications/UnifiedNotificationSettings';

export const ContractorProfile = () => {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const { updateProfile, loading } = useContractorSync();
  const { metrics } = useUnifiedHandymanMetrics();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: profile?.business_name || profile?.company_name || '',
    ownerName: profile?.full_name || '',
    description: 'Professional contractor specializing in residential and commercial construction projects.',
    phone: profile?.phone || '(555) 123-4567',
    website: 'https://example.com',
    licenseNumber: 'CON-2024-1234',
    insuranceAmount: '2M',
    insuranceProvider: 'State Farm Commercial',
    bondAmount: '500K',
    profileImage: profile?.avatar_url || '',
    serviceAreas: [profile?.city || 'Local Area', profile?.zip_code || 'Surrounding Areas'].filter(Boolean),
    specialties: ['General Construction', 'Renovations', 'Repairs', 'Maintenance'],
    certifications: ['General Contractor License', 'Insured & Bonded'],
    businessHours: {
      monday: { open: '07:00', close: '18:00', closed: false },
      tuesday: { open: '07:00', close: '18:00', closed: false },
      wednesday: { open: '07:00', close: '18:00', closed: false },
      thursday: { open: '07:00', close: '18:00', closed: false },
      friday: { open: '07:00', close: '18:00', closed: false },
      saturday: { open: '08:00', close: '16:00', closed: false },
      sunday: { open: '09:00', close: '15:00', closed: true }
    }
  });

  const [profileImage, setProfileImage] = useState(profile?.avatar_url || '');
  const [newService, setNewService] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newServiceArea, setNewServiceArea] = useState('');

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      // Keep business name and owner name completely separate
      const businessName = profile?.business_name || profile?.company_name || '';
      
      setFormData(prev => ({
        ...prev,
        businessName: businessName, // No fallback to owner name
        ownerName: profile?.full_name || '',
        phone: profile?.phone || prev.phone,
      }));
      setProfileImage(profile?.avatar_url || '');
    }
  }, [profile]);

  const handleSave = async () => {
    try {

      // Update profile with basic information AND business name in business_profiles
      const result = await updateProfile({
        ownerName: formData.ownerName,
        businessName: formData.businessName,
        profileImage: profileImage,
      });
      
      if (result?.success !== false) {
        setIsEditing(false);
        // Force a profile refresh to get the latest business name
        await refreshProfile();
        
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Profile save error:', error);
      toast({
        title: "Error",
        description: `Failed to update profile: ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Reset form data to original values - keep business name separate from owner name
    setFormData({
      businessName: profile?.business_name || profile?.company_name || '',
      ownerName: profile?.full_name || '',
      description: 'Professional contractor specializing in residential and commercial construction projects.',
      phone: profile?.phone || '(555) 123-4567',
      website: 'https://example.com',
      licenseNumber: 'CON-2024-1234',
      insuranceAmount: '2M',
      insuranceProvider: 'State Farm Commercial',
      bondAmount: '500K',
      profileImage: profile?.avatar_url || '',
      serviceAreas: [profile?.city || 'Local Area', profile?.zip_code || 'Surrounding Areas'].filter(Boolean),
      specialties: ['General Construction', 'Renovations', 'Repairs', 'Maintenance'],
      certifications: ['General Contractor License', 'Insured & Bonded'],
      businessHours: {
        monday: { open: '07:00', close: '18:00', closed: false },
        tuesday: { open: '07:00', close: '18:00', closed: false },
        wednesday: { open: '07:00', close: '18:00', closed: false },
        thursday: { open: '07:00', close: '18:00', closed: false },
        friday: { open: '07:00', close: '18:00', closed: false },
        saturday: { open: '08:00', close: '16:00', closed: false },
        sunday: { open: '09:00', close: '15:00', closed: true }
      }
    });
    setProfileImage(profile?.avatar_url || '');
    setIsEditing(false);
  };

  const handleImageUpload = async (imageUrl: string) => {
    try {
      console.log('Uploading image:', imageUrl);
      setProfileImage(imageUrl);
      setFormData({...formData, profileImage: imageUrl});
      
       const result = await updateProfile({
         ownerName: formData.ownerName,
         profileImage: imageUrl,
       });
      
      if (result?.success !== false) {
        await refreshProfile();
        
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "Error",
        description: `Failed to update profile picture: ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: "destructive",
      });
    }
  };

  const addItem = (type: 'service' | 'certification' | 'area', value: string) => {
    if (!value.trim()) return;
    
    switch (type) {
      case 'service':
        setFormData({
          ...formData,
          specialties: [...formData.specialties, value.trim()]
        });
        setNewService('');
        break;
      case 'certification':
        setFormData({
          ...formData,
          certifications: [...formData.certifications, value.trim()]
        });
        setNewCertification('');
        break;
      case 'area':
        setFormData({
          ...formData,
          serviceAreas: [...formData.serviceAreas, value.trim()]
        });
        setNewServiceArea('');
        break;
    }
  };

  const removeItem = (type: 'service' | 'certification' | 'area', index: number) => {
    switch (type) {
      case 'service':
        setFormData({
          ...formData,
          specialties: formData.specialties.filter((_, i) => i !== index)
        });
        break;
      case 'certification':
        setFormData({
          ...formData,
          certifications: formData.certifications.filter((_, i) => i !== index)
        });
        break;
      case 'area':
        setFormData({
          ...formData,
          serviceAreas: formData.serviceAreas.filter((_, i) => i !== index)
        });
        break;
    }
  };

  if (showAvailability) {
    return (
      <ContractorErrorBoundary>
        <AvailabilityManager onBack={() => setShowAvailability(false)} />
      </ContractorErrorBoundary>
    );
  }

  if (showTeamManagement) {
    return (
      <ContractorErrorBoundary>
        <TeamManagement onBack={() => setShowTeamManagement(false)} />
      </ContractorErrorBoundary>
    );
  }

  return (
    <ContractorErrorBoundary>
      <div className="space-y-4 sm:space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <ProfileHeader
              profile={profile}
              formData={formData}
              setFormData={setFormData}
              profileImage={profileImage}
              isEditing={isEditing}
              loading={loading}
              onSave={handleSave}
              onEdit={() => setIsEditing(true)}
              onCancel={handleCancel}
              onImageUpload={handleImageUpload}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ContractorErrorBoundary>
              <BusinessInformation
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                profile={profile}
              />
            </ContractorErrorBoundary>

            <ContractorErrorBoundary>
              <ServicesOffered
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                newService={newService}
                setNewService={setNewService}
                addItem={addItem}
                removeItem={removeItem}
              />
            </ContractorErrorBoundary>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ContractorErrorBoundary>
              <LicensesCertifications
                formData={formData}
                isEditing={isEditing}
                newCertification={newCertification}
                setNewCertification={setNewCertification}
                addItem={addItem}
                removeItem={removeItem}
              />
            </ContractorErrorBoundary>

            <ContractorErrorBoundary>
              <ServiceAreas
                formData={formData}
                isEditing={isEditing}
                newServiceArea={newServiceArea}
                setNewServiceArea={setNewServiceArea}
                addItem={addItem}
                removeItem={removeItem}
              />
            </ContractorErrorBoundary>

            <ContractorErrorBoundary>
              <UnifiedNotificationSettings />
            </ContractorErrorBoundary>

            <ContractorErrorBoundary>
              <QuickActions
                onShowAvailability={() => setShowAvailability(true)}
                onShowTeamManagement={() => setShowTeamManagement(true)}
              />
            </ContractorErrorBoundary>
          </div>
        </div>
      </div>
    </ContractorErrorBoundary>
  );
};
