
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { HandymanProfileData } from "@/types/handyman";

interface ProfileBioProps {
  profileData: HandymanProfileData;
  isEditing: boolean;
  onProfileDataChange: (data: HandymanProfileData) => void;
}

export const ProfileBio = ({ profileData, isEditing, onProfileDataChange }: ProfileBioProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Bio</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="bio">About You</Label>
        <textarea
          id="bio"
          className="w-full mt-2 p-3 border rounded-md h-24 resize-none"
          value={profileData.bio}
          disabled={!isEditing}
          onChange={(e) => onProfileDataChange({...profileData, bio: e.target.value})}
          placeholder="Tell customers about your experience and expertise..."
        />
      </CardContent>
    </Card>
  );
};
