import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Trash2, Play, FileVideo, Save, Video, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { VideoUpload } from '@/components/VideoUpload';
import { VideoModal } from '@/components/hero/VideoModal';

type TrainingResource = Tables<'training_resources'>;

export const CombinedVideoManager = () => {
  // Demo Video State
  const [demoVideoUrl, setDemoVideoUrl] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(true);
  const [demoError, setDemoError] = useState<string | null>(null);

  // Training Video State
  const [trainingResources, setTrainingResources] = useState<TrainingResource[]>([]);
  const [selectedTrainingResource, setSelectedTrainingResource] = useState<string>('');
  const [trainingUploading, setTrainingUploading] = useState(false);
  const [trainingVideoFile, setTrainingVideoFile] = useState<File | null>(null);
  const [trainingLoading, setTrainingLoading] = useState(true);

  // Video Modal State
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    loadDemoVideo();
    loadTrainingResources();
  }, []);

  // Demo Video Functions
  const loadDemoVideo = async () => {
    setDemoLoading(true);
    setDemoError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to manage videos');
      }

      const { data, error } = await supabase.storage
        .from('demo-videos')
        .list('videos', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      if (data && data.length > 0) {
        const { data: { publicUrl } } = supabase.storage
          .from('demo-videos')
          .getPublicUrl(`videos/${data[0].name}`);
        
        setDemoVideoUrl(publicUrl);
      } else {
        setDemoVideoUrl(null);
      }
    } catch (error: any) {
      setDemoError(error.message || 'Failed to load demo video');
      toast.error('Failed to load demo video');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleDemoVideoUploaded = (url: string) => {
    setDemoVideoUrl(url);
    toast.success('Demo video updated successfully!');
  };

  const handleDeleteDemoVideo = async () => {
    if (!demoVideoUrl) return;

    try {
      const urlParts = demoVideoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `videos/${fileName}`;

      const { error } = await supabase.storage
        .from('demo-videos')
        .remove([filePath]);

      if (error) throw error;

      setDemoVideoUrl(null);
      toast.success('Demo video deleted successfully');
    } catch (error: any) {
      toast.error(`Failed to delete demo video: ${error.message}`);
    }
  };

  // Training Video Functions
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

      setTrainingResources(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load training resources');
    } finally {
      setTrainingLoading(false);
    }
  };

  const handleTrainingFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setTrainingVideoFile(file);
      } else {
        toast.error('Please select a video file');
      }
    }
  };

  const uploadTrainingVideo = async () => {
    if (!trainingVideoFile || !selectedTrainingResource) {
      toast.error('Please select a training resource and video file');
      return;
    }

    setTrainingUploading(true);
    try {
      const fileExt = trainingVideoFile.name.split('.').pop();
      const fileName = `training-video-${selectedTrainingResource}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('training-videos')
        .upload(fileName, trainingVideoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('training-videos')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('training_resources')
        .update({ 
          video_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', parseInt(selectedTrainingResource));

      if (updateError) throw updateError;

      toast.success('Training video uploaded successfully!');
      setTrainingVideoFile(null);
      setSelectedTrainingResource('');
      loadTrainingResources();

      const fileInput = document.getElementById('training-video-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload training video');
    } finally {
      setTrainingUploading(false);
    }
  };

  const removeTrainingVideo = async (resourceId: number) => {
    try {
      const resource = trainingResources.find(r => r.id === resourceId);
      if (!resource?.video_url) return;

      const urlParts = resource.video_url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      const { error: deleteError } = await supabase.storage
        .from('training-videos')
        .remove([fileName]);

      if (deleteError) {
        console.error('Storage delete error:', deleteError);
      }

      const { error: updateError } = await supabase
        .from('training_resources')
        .update({ 
          video_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', resourceId);

      if (updateError) throw updateError;

      toast.success('Training video removed successfully!');
      loadTrainingResources();

    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove training video');
    }
  };

  const openVideoModal = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setIsVideoModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demo" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Demo Videos
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Training Videos
          </TabsTrigger>
        </TabsList>

        {/* Demo Videos Tab */}
        <TabsContent value="demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Demo Video Management
              </CardTitle>
              <CardDescription>
                Upload and manage demo videos that appear on the homepage when users click "Watch Demo"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {demoError && (
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span>{demoError}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadDemoVideo}
                    className="text-red-700 border-red-200 hover:bg-red-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              )}

              {demoLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading demo video...</p>
                  </div>
                </div>
              ) : (
                <>
                  <VideoUpload 
                    onVideoUploaded={handleDemoVideoUploaded}
                    currentVideoUrl={demoVideoUrl || undefined}
                  />

                  {demoVideoUrl && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Current Demo Video</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <video
                            src={demoVideoUrl}
                            className="w-full h-full object-cover"
                            poster="/lovable-uploads/3a9566aa-314d-45ec-9938-a6760464747a.png"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={() => openVideoModal(demoVideoUrl)} className="flex-1">
                            <Play className="w-4 h-4 mr-2" />
                            Preview Video
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={handleDeleteDemoVideo}
                            className="px-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Videos Tab */}
        <TabsContent value="training" className="space-y-6">
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
                  <Select value={selectedTrainingResource} onValueChange={setSelectedTrainingResource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a training resource..." />
                    </SelectTrigger>
                    <SelectContent>
                      {trainingResources.map((resource) => (
                        <SelectItem key={resource.id} value={resource.id.toString()}>
                          {resource.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="training-video-upload">Select Video File</Label>
                  <Input
                    id="training-video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleTrainingFileSelect}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {trainingVideoFile && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileVideo className="h-4 w-4" />
                    <span className="text-sm font-medium">{trainingVideoFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(trainingVideoFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}

              <Button 
                onClick={uploadTrainingVideo} 
                disabled={!trainingVideoFile || !selectedTrainingResource || trainingUploading}
                className="w-full"
              >
                {trainingUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Upload Training Video
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Training Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Training Resource Videos</CardTitle>
              <CardDescription>
                Manage videos for each training resource
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trainingLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading training resources...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainingResources.map((resource) => {
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
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openVideoModal(resource.video_url!)}
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                  >
                                    <Play className="h-4 w-4 mr-1" />
                                    Preview
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">No video</span>
                              )}

                              {hasVideo && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeTrainingVideo(resource.id)}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setSelectedVideo(null);
        }}
        videoUrl={selectedVideo || undefined}
      />
    </div>
  );
};
