
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Video, X, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VideoUploadProps {
  onVideoUploaded?: (url: string) => void;
  currentVideoUrl?: string;
}

export const VideoUpload = ({ onVideoUploaded, currentVideoUrl }: VideoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (file) {
      console.log('VideoUpload: File selected:', file.name, file.type, file.size);
      
      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        const errorMsg = 'Please select a video file (MP4, MOV, AVI, etc.)';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        const errorMsg = 'Video file must be less than 50MB';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      setSelectedFile(file);
      console.log('VideoUpload: File validated successfully');
    }
  };

  const uploadVideo = async () => {
    if (!selectedFile) {
      toast.error('Please select a video file first');
      return;
    }

    console.log('VideoUpload: Starting upload process');
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    let progressInterval: NodeJS.Timeout | null = null;

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to upload videos');
      }

      console.log('VideoUpload: User authenticated, proceeding with upload');

      // Create file name with timestamp
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `demo-video-${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      console.log('VideoUpload: Uploading to path:', filePath);

      // Create a progress simulation
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // First, try to delete any existing demo video
      try {
        const { data: existingFiles } = await supabase.storage
          .from('demo-videos')
          .list('videos');

        if (existingFiles && existingFiles.length > 0) {
          console.log('VideoUpload: Removing existing videos:', existingFiles.length);
          const filesToRemove = existingFiles.map(file => `videos/${file.name}`);
          await supabase.storage
            .from('demo-videos')
            .remove(filesToRemove);
        }
      } catch (cleanupError) {
        console.warn('VideoUpload: Error cleaning up existing files:', cleanupError);
        // Continue with upload even if cleanup fails
      }

      // Upload the new video
      const { error: uploadError, data } = await supabase.storage
        .from('demo-videos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setUploadProgress(100);

      if (uploadError) {
        console.error('VideoUpload: Upload error:', uploadError);
        throw uploadError;
      }

      console.log('VideoUpload: Upload successful:', data);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('demo-videos')
        .getPublicUrl(filePath);

      console.log('VideoUpload: Public URL generated:', publicUrl);

      toast.success('Video uploaded successfully!');
      onVideoUploaded?.(publicUrl);
      setSelectedFile(null);
      
    } catch (error: any) {
      console.error('VideoUpload: Upload failed:', error);
      const errorMessage = error.message || 'Upload failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Upload Demo Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {!selectedFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="video-upload"
              disabled={uploading}
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Click to upload your demo video
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports MP4, MOV, AVI files up to 50MB
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!uploading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeSelectedFile}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={uploadVideo}
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {currentVideoUrl && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <Check className="w-4 h-4" />
              <span className="font-medium">Current demo video is uploaded</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Upload a new video to replace the current one
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
