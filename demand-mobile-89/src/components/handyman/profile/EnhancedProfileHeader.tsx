
import { Card, CardContent } from "@/components/ui/card";
import { HandymanProfileData } from "@/types/handyman";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileActions } from "./ProfileActions";
import { ProfileStats } from "./ProfileStats";
import { ContactInfo } from "./ContactInfo";

interface ProfileStats {
  rating: number;
  reviewCount: number;
  totalJobs: number;
  completedJobs: number;
  responseRate: number;
  clientRetention: number;
}

interface EnhancedProfileHeaderProps {
  profileData: HandymanProfileData;
  stats: ProfileStats;
  profilePicture: string;
  isEditing: boolean;
  loading: boolean;
  onProfileDataChange: (data: HandymanProfileData) => void;
  onProfilePictureUpdate: (imageUrl: string) => void;
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export const EnhancedProfileHeader = ({
  profileData,
  stats,
  profilePicture,
  isEditing,
  loading,
  onProfileDataChange,
  onProfilePictureUpdate,
  onSave,
  onEdit,
  onCancel
}: EnhancedProfileHeaderProps) => {
  return (
    <div className="relative isolate overflow-hidden group">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(22,101,52,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="bg-white rounded-[32px] sm:rounded-[48px] border border-black/5 overflow-hidden transition-all duration-500 hover:border-emerald-100/50">
        <div className="p-8 sm:p-12 md:p-16 lg:p-20 relative">
          <div className="flex flex-col items-center gap-12 sm:gap-16 lg:gap-20">
            {/* Profile Avatar - Centered with decorative glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full -z-10 scale-150 animate-pulse" />
              <ProfileAvatar
                profilePicture={profilePicture}
                profileName={profileData.name}
                isEditing={isEditing}
                onProfilePictureUpdate={onProfilePictureUpdate}
              />
            </div>

            {/* Main Profile Content - Centered */}
            <div className="w-full space-y-12 sm:space-y-16 lg:space-y-20">
              {/* Profile Info - Centered */}
              <div className="text-center animate-fade-in [animation-delay:200ms]">
                <ProfileInfo
                  profileData={profileData}
                />
              </div>

              {/* Stats Grid - Centered */}
              <div className="w-full animate-fade-in [animation-delay:400ms]">
                <ProfileStats mockStats={stats} />
              </div>

              {/* Bottom Actions Cluster */}
              <div className="flex flex-col items-center gap-10 animate-fade-in [animation-delay:600ms]">
                {/* Contact Info - Pill Style */}
                <div className="w-full max-w-3xl">
                  <ContactInfo
                    email={profileData.email}
                    phone={profileData.phone}
                  />
                </div>

                {/* Edit Profile Button */}
                <ProfileActions
                  isEditing={isEditing}
                  loading={loading}
                  onSave={onSave}
                  onEdit={onEdit}
                  onCancel={onCancel}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom decorative bar */}
        <div className="h-1.5 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
      </div>
    </div>
  );
};
