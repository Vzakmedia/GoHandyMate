
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Award, Edit, Save, X } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth';

interface ExperienceEditorProps {
  currentExperience: number;
  onUpdate: (newExperience: number) => void;
}

export const ExperienceEditor = ({ currentExperience, onUpdate }: ExperienceEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [experience, setExperience] = useState(currentExperience);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Update the handyman table with years_experience
      const { error } = await supabase
        .from('handyman')
        .upsert({ 
          user_id: user.id,
          years_experience: experience 
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      onUpdate(experience);
      setIsEditing(false);
      toast.success('Experience updated successfully');
    } catch (error) {
      console.error('Error updating experience:', error);
      toast.error('Failed to update experience');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setExperience(currentExperience);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Experience</span>
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="1"
                max="50"
                value={experience}
                onChange={(e) => setExperience(parseInt(e.target.value) || 1)}
                placeholder="Enter years of experience"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                size="sm"
                className="flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {currentExperience}
            </div>
            <div className="text-gray-600">
              Year{currentExperience !== 1 ? 's' : ''} of Experience
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
