
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { HandymanProfileData, HandymanStats } from "@/types/handyman";
import { User, Star, Phone, Mail, MapPin } from "lucide-react";

interface ProfileHeaderProps {
  profileData: HandymanProfileData;
  stats: HandymanStats;
  profilePicture: string;
  isEditing: boolean;
  onProfileDataChange: (data: HandymanProfileData) => void;
  onProfilePictureUpdate: (imageUrl: string) => void;
}

export const ProfileHeader = ({
  profileData,
  stats,
  profilePicture,
  isEditing,
  onProfileDataChange,
  onProfilePictureUpdate
}: ProfileHeaderProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Picture & Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <ProfilePictureUpload
            currentImageUrl={profilePicture}
            onImageUpdate={onProfilePictureUpdate}
            size="lg"
          />
          <div className="text-center">
            <h3 className="font-semibold text-lg">{profileData.name}</h3>
            <p className="text-gray-600">Professional Handyman</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{stats.rating}</span>
              <span className="text-gray-600">({stats.totalJobs} jobs)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profileData.name}
              disabled={!isEditing}
              onChange={(e) => onProfileDataChange({...profileData, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled={!isEditing}
                onChange={(e) => onProfileDataChange({...profileData, email: e.target.value})}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                value={profileData.phone}
                disabled={!isEditing}
                onChange={(e) => onProfileDataChange({...profileData, phone: e.target.value})}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <Input
                id="location"
                value={profileData.location}
                disabled={!isEditing}
                onChange={(e) => onProfileDataChange({...profileData, location: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Total Jobs:</span>
            <span className="font-semibold">{stats.totalJobs}</span>
          </div>
          <div className="flex justify-between">
            <span>Average Rating:</span>
            <span className="font-semibold">{stats.rating}/5</span>
          </div>
          <div className="flex justify-between">
            <span>Response Rate:</span>
            <span className="font-semibold">{stats.responseRate}%</span>
          </div>
          <div className="flex justify-between">
            <span>On-Time Rate:</span>
            <span className="font-semibold">{stats.onTimeRate}%</span>
          </div>
          <div className="flex justify-between">
            <span>Repeat Customers:</span>
            <span className="font-semibold">{stats.repeatCustomers}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
