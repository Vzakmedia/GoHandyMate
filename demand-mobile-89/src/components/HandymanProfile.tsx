
import { useState } from "react";
import { mockHandymanSkills, mockHandymanStats } from "@/data/handymanData";
import { EnhancedProfileHeader } from "@/components/handyman/profile/EnhancedProfileHeader";
import { ProfileTabs } from "@/components/handyman/profile/ProfileTabs";
import { ProfileProvider, useProfile } from "@/components/handyman/profile/ProfileProvider";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";

const ProfileContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    profileData, 
    setProfileData, 
    profilePicture, 
    setProfilePicture, 
    isEditing, 
    setIsEditing, 
    loading, 
    handleSave, 
    handleCancel 
  } = useProfile();

  const enhancedStats = {
    rating: mockHandymanStats.rating,
    reviewCount: mockHandymanStats.reviewCount,
    totalJobs: mockHandymanStats.totalJobs,
    completedJobs: mockHandymanStats.completedJobs,
    responseRate: 95,
    clientRetention: 85
  };

  const handleProfilePictureUpdate = (imageUrl: string) => {
    setProfilePicture(imageUrl);
    console.log('Profile picture updated:', imageUrl);
  };

  return (
    <ResponsiveLayout className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="space-y-3 sm:space-y-4 md:space-y-6 py-3 sm:py-4 md:py-6">
          {/* Enhanced Profile Header with proper responsive design */}
          <div className="w-full">
            <EnhancedProfileHeader
              profileData={profileData}
              stats={enhancedStats}
              profilePicture={profilePicture}
              isEditing={isEditing}
              loading={loading}
              onProfileDataChange={setProfileData}
              onProfilePictureUpdate={handleProfilePictureUpdate}
              onSave={handleSave}
              onEdit={() => setIsEditing(true)}
              onCancel={handleCancel}
            />
          </div>

          {/* Profile Tabs with responsive design */}
          <div className="w-full">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export const HandymanProfile = () => {
  const initialServiceAreas = [
    'Downtown', 'Midtown', 'Uptown', 'Westside', 'Suburbs'
  ];

  return (
    <ProfileProvider 
      initialSkills={mockHandymanSkills} 
      initialServiceAreas={initialServiceAreas}
    >
      <ProfileContent />
    </ProfileProvider>
  );
};
