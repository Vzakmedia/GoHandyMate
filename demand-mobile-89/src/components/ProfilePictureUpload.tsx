
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Upload, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/features/auth';
import { toast } from "sonner";

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfilePictureUpload = ({ 
  currentImageUrl, 
  onImageUpdate, 
  size = 'md' 
}: ProfilePictureUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      if (!user) {
        throw new Error('You must be logged in to upload a profile picture.');
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file.');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be less than 5MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading file to:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        console.log('Upload successful, public URL:', data.publicUrl);
        onImageUpdate(data.publicUrl);
        toast.success('Profile picture updated successfully!');
      } else {
        throw new Error('Failed to get public URL for uploaded image.');
      }

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-4 border-white shadow-lg`}>
          <AvatarImage src={currentImageUrl} alt="Profile picture" />
          <AvatarFallback className="bg-gray-100">
            <User className={`text-gray-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16'}`} />
          </AvatarFallback>
        </Avatar>
        
        <label 
          htmlFor="avatar-upload" 
          className={`absolute -bottom-2 -right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Camera className="w-4 h-4" />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => document.getElementById('avatar-upload')?.click()}
        disabled={uploading}
      >
        <Upload className="w-4 h-4" />
        {uploading ? 'Uploading...' : 'Change Photo'}
      </Button>
    </div>
  );
};
