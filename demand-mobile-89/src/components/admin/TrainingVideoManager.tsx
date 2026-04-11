import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Trash2, Play, FileVideo, Save } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type TrainingResource = Tables<'training_resources'>;

export const TrainingVideoManager = () => {
  const [resources, setResources] = useState<TrainingResource[]>([]);
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainingResources();
  }, []);

  const loadTrainingResources = async () => {
    try {
      const { data, error } = await supabase
        .from('training_resources')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error loading training resources:', error);
        toast.error('Failed to load training resources');
        return;
      }

      setResources(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load training resources');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
      } else {
        toast.error('Please select a video file');
      }
    }
  };

  const uploadVideo = async () => {
    if (!videoFile || !selectedResource) {
      toast.error('Please select a training resource and video file');
      return;
    }

    setUploading(true);
    try {
      // Create a unique filename for the video
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `training-video-${selectedResource}-${Date.now()}.${fileExt}`;

      // Upload video to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('training-videos')
        .upload(fileName, videoFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded video
      const { data: { publicUrl } } = supabase.storage
        .from('training-videos')
        .getPublicUrl(fileName);

      // Update the training resource with the video URL
      const { error: updateError } = await supabase
        .from('training_resources')
        .update({ 
          video_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', parseInt(selectedResource));

      if (updateError) {
        throw updateError;
      }

      toast.success('Video uploaded successfully!');
      setVideoFile(null);
      setSelectedResource('');
      loadTrainingResources();

      // Reset file input
      const fileInput = document.getElementById('video-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = async (resourceId: number) => {
    try {
      const resource = resources.find(r => r.id === resourceId);
      if (!resource?.video_url) return;

      // Extract filename from URL to delete from storage
      const urlParts = resource.video_url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('training-videos')
        .remove([fileName]);

      if (deleteError) {
        console.error('Storage delete error:', deleteError);
      }

      // Update database to remove video URL
      const { error: updateError } = await supabase
        .from('training_resources')
        .update({ 
          video_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', resourceId);

      if (updateError) {
        throw updateError;
      }

      toast.success('Video removed successfully!');
      loadTrainingResources();

    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove video');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading training resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Training Video
          </CardTitle>
          <CardDescription>
            Upload videos for the training resource cards on the Pro Resources page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resource-select">Select Training Resource</Label>
          <Select value={selectedResource} onValueChange={setSelectedResource}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a training resource..." />
                </SelectTrigger>
                <SelectContent>
                  {resources.map((resource) => (
                    <SelectItem key={resource.id} value={resource.id.toString()}>
                      {resource.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-upload">Select Video File</Label>
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>
          </div>

          {videoFile && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileVideo className="h-4 w-4" />
                <span className="text-sm font-medium">{videoFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
            </div>
          )}

          <Button 
            onClick={uploadVideo} 
            disabled={!videoFile || !selectedResource || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Upload Video
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Training Resource Videos</CardTitle>
          <CardDescription>
            Manage videos for each training resource
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => {
              const hasVideo = resource.video_url;

              return (
                <Card key={resource.id} className="relative">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm leading-tight">{resource.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {resource.level}
                          </span>
                          <span className="text-xs text-muted-foreground">{resource.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {hasVideo ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-green-600">
                              <Play className="h-4 w-4" />
                              <span className="text-xs font-medium">Video uploaded</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No video</span>
                        )}

                        {hasVideo && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeVideo(resource.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
