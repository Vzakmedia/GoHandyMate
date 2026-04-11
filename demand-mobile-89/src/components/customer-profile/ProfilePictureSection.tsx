
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { User } from "lucide-react";

interface ProfilePictureSectionProps {
  profilePicture: string;
  onImageUpdate: (imageUrl: string) => void;
}

export const ProfilePictureSection = ({ profilePicture, onImageUpdate }: ProfilePictureSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Picture
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ProfilePictureUpload
          currentImageUrl={profilePicture}
          onImageUpdate={onImageUpdate}
          size="lg"
        />
      </CardContent>
    </Card>
  );
};
