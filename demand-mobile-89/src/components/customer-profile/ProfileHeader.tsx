
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";

interface ProfileHeaderProps {
  isEditing: boolean;
  loading: boolean;
  onToggleEdit: () => void;
}

export const ProfileHeader = ({ isEditing, loading, onToggleEdit }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
      <Button
        onClick={onToggleEdit}
        variant="outline"
        className="flex items-center gap-2"
        disabled={loading}
      >
        <Edit3 className="w-4 h-4" />
        {isEditing ? 'Cancel' : 'Edit Profile'}
      </Button>
    </div>
  );
};
