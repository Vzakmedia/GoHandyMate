
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HandymanProfileData } from '@/types/handyman';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileContextType {
  profileData: HandymanProfileData;
  setProfileData: (data: HandymanProfileData) => void;
  profilePicture: string;
  setProfilePicture: (url: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  loading: boolean;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  skills: any[];
  setSkills: (skills: any[]) => void;
  serviceAreas: string[];
  setServiceAreas: (areas: string[]) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
  initialSkills: any[];
  initialServiceAreas: string[];
}

export const ProfileProvider = ({ children, initialSkills, initialServiceAreas }: ProfileProviderProps) => {
  const { user, profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(initialSkills);
  const [serviceAreas, setServiceAreas] = useState(initialServiceAreas);
  
  const [profileData, setProfileData] = useState<HandymanProfileData>({
    name: profile?.full_name || "Handyman Professional",
    email: profile?.email || "handyman@example.com",
    phone: "+1 (555) 123-4567",
    location: "Service Area",
    bio: "Professional handyman with years of experience in home repairs and maintenance.",
    hourlyRate: 45,
    experience: "5+ years",
    availability: true
  });

  useEffect(() => {
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        name: profile.full_name || prev.name,
        email: profile.email || prev.email
      }));
      
      const avatarUrl = (profile as any).avatar_url;
      if (avatarUrl) {
        setProfilePicture(avatarUrl);
      }
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to update profile');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('handyman-profile-update', {
        body: { 
          profileData: {
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            hourlyRate: profileData.hourlyRate,
            availability: profileData.availability ? 'Available' : 'Not Available',
            skills: skills.map(skill => skill.name),
            location: profileData.location,
            bio: profileData.bio,
            experience: profileData.experience
          },
          skills: skills,
          userId: user.id,
          profilePicture: profilePicture
        }
      });

      if (error) {
        throw error;
      }

      if (data && data.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        await refreshProfile();
      } else {
        toast.error(data?.error || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      if (error.message?.includes('handyman role')) {
        toast.error('Only handyman accounts can update handyman profiles. Please contact support if this is incorrect.');
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        name: profile.full_name || prev.name,
        email: profile.email || prev.email
      }));
    }
    setIsEditing(false);
  };

  return (
    <ProfileContext.Provider value={{
      profileData,
      setProfileData,
      profilePicture,
      setProfilePicture,
      isEditing,
      setIsEditing,
      loading,
      handleSave,
      handleCancel,
      skills,
      setSkills,
      serviceAreas,
      setServiceAreas
    }}>
      {children}
    </ProfileContext.Provider>
  );
};
