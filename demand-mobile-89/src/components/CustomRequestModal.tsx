
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { useLocationTracking } from '@/hooks/useLocationTracking';

interface CustomRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomRequestModal = ({ isOpen, onClose }: CustomRequestModalProps) => {
  const { user } = useAuth();
  const { currentLocation } = useLocationTracking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
    urgency: 'flexible',
    preferredDate: '',
    preferredTime: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to post a request');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        category: formData.category || 'general',
        customer_id: user.id,
        location: formData.location,
        budget: formData.budget ? parseInt(formData.budget) : null,
        priority: formData.urgency === 'emergency' ? 'high' : formData.urgency === 'same_day' ? 'medium' : 'low',
        status: 'pending',
        job_type: 'custom_request',
        preferred_schedule: formData.preferredDate && formData.preferredTime ? 
          new Date(`${formData.preferredDate}T${formData.preferredTime}`).toISOString() : null
      };

      const { data, error } = await supabase
        .from('job_requests')
        .insert(jobData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Custom request posted successfully!');
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        location: '',
        budget: '',
        urgency: 'flexible',
        preferredDate: '',
        preferredTime: ''
      });
    } catch (error: any) {
      console.error('Error posting custom request:', error);
      toast.error('Failed to post request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-white border-b border-gray-200 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-green-600" />
            <span>Post a Custom Request</span>
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Request Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Need help with kitchen renovation"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a category</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="painting">Painting</option>
                  <option value="hvac">HVAC</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="renovation">Renovation</option>
                  <option value="general">General Handyman</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Please describe your project in detail..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Service Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Full address where service is needed"
                  className="pl-10"
                  required
                />
              </div>
              {currentLocation && (
                <p className="text-xs text-gray-600 mt-1">
                  Current location detected. You can use it or enter a different address.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budget">Budget (Optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="Your budget"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input
                  id="preferredTime"
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <select
                id="urgency"
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="flexible">Flexible (Standard Rate)</option>
                <option value="same_day">Same Day (+50%)</option>
                <option value="emergency">Emergency (+100%)</option>
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                How it works
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your request will be visible to all professionals in your area</li>
                <li>• You'll receive quotes and proposals from interested professionals</li>
                <li>• You can review profiles and choose the best fit for your project</li>
                <li>• Payment is only processed after work is completed</li>
              </ul>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
