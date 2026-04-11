
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileHeader } from "./customer-profile/ProfileHeader";
import { ProfilePictureSection } from "./customer-profile/ProfilePictureSection";
import { PersonalInformationSection } from "./customer-profile/PersonalInformationSection";
import { UnifiedNotificationSettings } from "@/components/notifications/UnifiedNotificationSettings";
import { SecuritySettingsSection } from "./customer-profile/SecuritySettingsSection";
import { PaymentMethodsSection } from "./customer-profile/PaymentMethodsSection";
import { CustomerPropertiesSection } from "./customer-profile/CustomerPropertiesSection";

export const CustomerProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        zipCode: profile.zip_code || ''
      });
      setProfilePicture(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user || !profile) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setLoading(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip_code: formData.zipCode,
          avatar_url: profilePicture,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      await refreshProfile();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error updating profile:', error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpdate = async (imageUrl: string) => {
    setProfilePicture(imageUrl);

    if (!user) {
      toast.error("You must be logged in to update your profile picture");
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast.success("Profile picture updated successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error updating profile picture:', error);
      toast.error("Failed to update profile picture");
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success("Notification preferences updated");
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        zipCode: profile.zip_code || ''
      });
      setProfilePicture(profile.avatar_url || '');
    }
    setIsEditing(false);
  };

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        isEditing={isEditing}
        loading={loading}
        onToggleEdit={handleToggleEdit}
      />

      <ProfilePictureSection
        profilePicture={profilePicture}
        onImageUpdate={handleProfilePictureUpdate}
      />

      <PersonalInformationSection
        formData={formData}
        isEditing={isEditing}
        loading={loading}
        onFormDataChange={handleFormDataChange}
        onSave={handleSaveProfile}
        onCancel={handleCancel}
      />

      <CustomerPropertiesSection />

      <UnifiedNotificationSettings />

      <SecuritySettingsSection />

      <PaymentMethodsSection />
    </div>
  );
};
