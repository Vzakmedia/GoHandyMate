
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { useAuth } from '@/features/auth';
import { useHandymanData } from "@/hooks/useHandymanData";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  profilePicture: string;
  profileName: string;
  isEditing: boolean;
  onProfilePictureUpdate: (imageUrl: string) => void;
}

export const ProfileAvatar = ({
  profilePicture,
  profileName,
  isEditing,
  onProfilePictureUpdate
}: ProfileAvatarProps) => {
  const { profile } = useAuth();
  const { data: handymanData } = useHandymanData();

  const displayName = profile?.full_name || profileName;
  const avatarUrl = profile?.avatar_url || profilePicture;
  
  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'HM';

  if (isEditing) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 w-full animate-fade-in">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-tr from-[#166534] to-emerald-400 rounded-full blur-[2px] opacity-20" />
          <ProfilePictureUpload
            currentImageUrl={avatarUrl}
            onImageUpdate={onProfilePictureUpdate}
            size="lg"
          />
        </div>
        <p className="text-[11px] font-black uppercase tracking-widest text-[#166534]">
          Tap to Update Photo
        </p>
      </div>
    );
  }

  const isActive = handymanData.skillRates?.length > 0;

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full animate-fade-in">
      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-tr from-[#166534] via-emerald-200 to-white rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
        <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-[6px] border-white relative z-10">
          <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
          <AvatarFallback className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-[#166534] to-emerald-800 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Real-time status indicator - positioned on avatar */}
        <div className={cn(
          "absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white z-20 transition-colors duration-500",
          isActive ? "bg-emerald-500" : "bg-amber-400"
        )}>
           <div className={cn(
             "absolute inset-0 rounded-full animate-ping opacity-40",
             isActive ? "bg-emerald-500" : "bg-amber-400"
           )} />
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-50 border border-black/5">
        <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-emerald-500" : "bg-amber-400")} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          {isActive ? 'Verified Active Professional' : 'Profile in calibration...'}
        </span>
      </div>
    </div>
  );
};
