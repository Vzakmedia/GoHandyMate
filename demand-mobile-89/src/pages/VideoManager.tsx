
import { useState, useEffect } from "react";
import { VideoUpload } from "@/components/VideoUpload";
import { VideoModal } from "@/components/hero/VideoModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function VideoManager() {
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentVideo();
  }, []);

  const loadCurrentVideo = async () => {
    console.log('VideoManager: Loading current video');
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to manage videos');
      }

      // Try to load the demo video from storage
      const { data, error } = await supabase.storage
        .from('demo-videos')
        .list('videos', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('VideoManager: Error loading video list:', error);
        throw error;
      }

      console.log('VideoManager: Video list loaded:', data);

      if (data && data.length > 0) {
        const { data: { publicUrl } } = supabase.storage
          .from('demo-videos')
          .getPublicUrl(`videos/${data[0].name}`);
        
        console.log('VideoManager: Current video URL:', publicUrl);
        setCurrentVideoUrl(publicUrl);
      } else {
        console.log('VideoManager: No videos found');
        setCurrentVideoUrl(null);
      }
    } catch (error: any) {
      console.error('VideoManager: Error loading current video:', error);
      setError(error.message || 'Failed to load video');
      toast.error('Failed to load current video');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUploaded = (url: string) => {
    console.log('VideoManager: New video uploaded:', url);
    setCurrentVideoUrl(url);
    toast.success('Demo video updated successfully!');
  };

  const handleDeleteVideo = async () => {
    if (!currentVideoUrl) return;

    console.log('VideoManager: Deleting video:', currentVideoUrl);

    try {
      // Extract the file path from the URL
      const urlParts = currentVideoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `videos/${fileName}`;

      console.log('VideoManager: Deleting file at path:', filePath);

      const { error } = await supabase.storage
        .from('demo-videos')
        .remove([filePath]);

      if (error) {
        console.error('VideoManager: Delete error:', error);
        throw error;
      }

      console.log('VideoManager: Video deleted successfully');
      setCurrentVideoUrl(null);
      toast.success('Video deleted successfully');
    } catch (error: any) {
      console.error('VideoManager: Error deleting video:', error);
      toast.error(`Failed to delete video: ${error.message}`);
    }
  };

  const previewVideo = () => {
    console.log('VideoManager: Opening video preview');
    setIsVideoModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demo Video Manager
          </h1>
          <p className="text-gray-600">
            Upload and manage your GoHandyMate demo video
          </p>
        </div>

        {error && (
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadCurrentVideo}
              className="text-red-700 border-red-200 hover:bg-red-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        <VideoUpload 
          onVideoUploaded={handleVideoUploaded}
          currentVideoUrl={currentVideoUrl || undefined}
        />

        {currentVideoUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Current Demo Video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video
                  src={currentVideoUrl}
                  className="w-full h-full object-cover"
                  poster="/lovable-uploads/3a9566aa-314d-45ec-9938-a6760464747a.png"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={previewVideo} className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Preview Video
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteVideo}
                  className="px-4"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={currentVideoUrl || undefined}
        />
      </div>
    </div>
  );
}
