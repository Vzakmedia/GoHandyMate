
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, Download, Eye, Trash2, Plus, Calendar, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';

interface Photo {
  id: string;
  title: string;
  description: string;
  photo_type: 'before' | 'progress' | 'after';
  photo_url: string;
  location: string;
  taken_date: string;
  project_id: string | null;
  file_size: number;
  mime_type: string;
}

interface Project {
  id: string;
  title: string;
  client: string;
}

export const PhotoDocumentation = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState('all');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    project_id: '',
    photo_type: '',
    title: '',
    description: '',
    location: '',
    taken_date: new Date().toISOString().split('T')[0]
  });

  // Load projects and photos on component mount
  useEffect(() => {
    if (user) {
      loadProjects();
      loadPhotos();
    }
  }, [user]);

  // Set up realtime subscription for photos
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('project-photos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_photos',
          filter: `contractor_id=eq.${user.id}`
        },
        () => {
          loadPhotos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('contractor_projects')
        .select('id, title, client')
        .eq('contractor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_photos')
        .select('*')
        .eq('contractor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Photo interface
      const transformedPhotos: Photo[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        photo_type: item.photo_type as 'before' | 'progress' | 'after',
        photo_url: item.photo_url,
        location: item.location || '',
        taken_date: item.taken_date,
        project_id: item.project_id,
        file_size: item.file_size || 0,
        mime_type: item.mime_type || ''
      }));
      
      setPhotos(transformedPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log('File upload triggered', files);
    console.log('Form data:', formData);

    if (!formData.project_id || !formData.photo_type || !formData.title) {
      toast({
        title: "Missing Information",
        description: "Please fill in project, photo type, and title before uploading",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File",
            description: "Please upload only image files",
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: "Please upload files smaller than 10MB",
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('project-photos')
          .getPublicUrl(fileName);

        // Save photo metadata to database
        const { error: dbError } = await supabase
          .from('project_photos')
          .insert({
            contractor_id: user?.id,
            project_id: formData.project_id === 'none' ? null : formData.project_id,
            title: formData.title,
            description: formData.description,
            photo_type: formData.photo_type,
            photo_url: urlData.publicUrl,
            location: formData.location,
            taken_date: formData.taken_date,
            file_size: file.size,
            mime_type: file.type
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Success",
        description: `${files.length} photo(s) uploaded successfully`,
      });

      // Reset form
      setFormData({
        project_id: '',
        photo_type: '',
        title: '',
        description: '',
        location: '',
        taken_date: new Date().toISOString().split('T')[0]
      });

      // Clear file input
      event.target.value = '';

    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string, photoUrl: string) => {
    try {
      // Extract filename from URL
      const urlParts = photoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user?.id}/${fileName}`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('project-photos')
        .remove([filePath]);

      if (storageError) console.warn('Storage deletion error:', storageError);

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_photos')
        .delete()
        .eq('id', photoId);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });

    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const filteredPhotos = selectedProject === 'all' 
    ? photos 
    : photos.filter(photo => photo.project_id === selectedProject);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'before': return 'bg-red-100 text-red-800';
      case 'progress': return 'bg-yellow-100 text-yellow-800';
      case 'after': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return 'General';
    const project = projects.find(p => p.id === projectId);
    return project ? `${project.title} - ${project.client}` : 'Unknown Project';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Camera className="w-6 h-6 mr-2 text-blue-600" />
            Photo Documentation
          </h2>
          <p className="text-gray-600">Manage before/after photos and progress tracking</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => {
              toast({
                title: "Export Started",
                description: "Photo export will be available soon",
              });
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Photos
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="project">Project *</Label>
              <select 
                id="project"
                className="w-full p-2 border rounded-md"
                value={formData.project_id}
                onChange={(e) => setFormData({...formData, project_id: e.target.value})}
              >
                <option value="">Select project</option>
                <option value="none">General (No specific project)</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title} - {project.client}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="photoType">Photo Type *</Label>
              <select 
                id="photoType"
                className="w-full p-2 border rounded-md"
                value={formData.photo_type}
                onChange={(e) => setFormData({...formData, photo_type: e.target.value})}
              >
                <option value="">Select type</option>
                <option value="before">Before</option>
                <option value="progress">Progress</option>
                <option value="after">After</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="photoTitle">Title *</Label>
              <Input
                id="photoTitle"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Kitchen Before Renovation"
              />
            </div>
            <div>
              <Label htmlFor="photoLocation">Location</Label>
              <Input
                id="photoLocation"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Main Kitchen"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="photoDate">Date</Label>
              <Input
                id="photoDate"
                type="date"
                value={formData.taken_date}
                onChange={(e) => setFormData({...formData, taken_date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="photoDescription">Description</Label>
              <Textarea
                id="photoDescription"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Optional description"
                rows={2}
              />
            </div>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="photo-upload"
              disabled={uploading}
            />
            <label htmlFor="photo-upload" className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {uploading ? (
                <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
              ) : (
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              )}
              <p className="text-lg font-medium text-gray-900 mb-2">
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </p>
              <p className="text-gray-600">Drag and drop files here, or click to select</p>
              <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, HEIC up to 10MB each</p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Label>Filter by Project:</Label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedProject('all')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedProject === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Photos ({photos.length})
              </button>
              {projects.map(project => {
                const count = photos.filter(p => p.project_id === project.id).length;
                return (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedProject === project.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {project.title} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading photos...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={photo.photo_url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={getTypeColor(photo.photo_type)}>
                    {photo.photo_type.charAt(0).toUpperCase() + photo.photo_type.slice(1)}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{photo.title}</h3>
                {photo.description && (
                  <p className="text-sm text-gray-600 mb-3">{photo.description}</p>
                )}
                
                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(photo.taken_date).toLocaleDateString()}</span>
                  </div>
                  {photo.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{photo.location}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    Project: {getProjectName(photo.project_id)}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(photo.photo_url, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = photo.photo_url;
                      a.download = photo.title;
                      a.click();
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeletePhoto(photo.id, photo.photo_url)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredPhotos.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Found</h3>
            <p className="text-gray-600 mb-4">
              {selectedProject === 'all' 
                ? 'Start by uploading your first project photos'
                : 'No photos found for the selected project'
              }
            </p>
            <Button onClick={() => document.getElementById('photo-upload')?.click()}>
              <Plus className="w-4 h-4 mr-2" />
              Upload First Photo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
