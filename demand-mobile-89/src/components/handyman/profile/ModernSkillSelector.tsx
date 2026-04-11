
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, DollarSign, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface SelectedSkill {
  categoryId: string;
  subcategoryId?: string;
  skillName: string;
  hourlyRate: number;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  isActive: boolean;
  sameDayMultiplier?: number;
  emergencyMultiplier?: number;
  minimumHours?: number;
}

interface ModernSkillSelectorProps {
  selectedSkills: SelectedSkill[];
  onSkillsChange: (skills: SelectedSkill[]) => void;
  isEditing: boolean;
}

export const ModernSkillSelector = ({
  selectedSkills,
  onSkillsChange,
  isEditing
}: ModernSkillSelectorProps) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillExperience, setNewSkillExperience] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');

  const addNewSkill = () => {
    if (!newSkillName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    // Check for duplicate skills
    const isDuplicate = selectedSkills.some(
      skill => skill.skillName.toLowerCase() === newSkillName.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error('This skill already exists');
      return;
    }

    const newSkill: SelectedSkill = {
      categoryId: 'custom',
      skillName: newSkillName.trim(),
      hourlyRate: 0, // Default value, will be set elsewhere
      experienceLevel: newSkillExperience,
      isActive: true,
      sameDayMultiplier: 1.5,
      emergencyMultiplier: 2.0,
      minimumHours: 1.0
    };

    onSkillsChange([...selectedSkills, newSkill]);
    setNewSkillName('');
    setNewSkillExperience('Intermediate');
    toast.success('Skill added successfully');
  };

  const updateSkill = (index: number, updates: Partial<SelectedSkill>) => {
    const updatedSkills = selectedSkills.map((skill, i) => {
      if (i === index) {
        const updatedSkill = { ...skill, ...updates };
        
        // Validate numeric values for existing skills
        if ('hourlyRate' in updates && (isNaN(Number(updates.hourlyRate)) || Number(updates.hourlyRate) < 0)) {
          toast.error('Hourly rate must be a valid positive number');
          return skill;
        }
        
        if ('minimumHours' in updates && (isNaN(Number(updates.minimumHours)) || Number(updates.minimumHours) < 0)) {
          toast.error('Minimum hours must be a valid positive number');
          return skill;
        }
        
        if ('sameDayMultiplier' in updates && (isNaN(Number(updates.sameDayMultiplier)) || Number(updates.sameDayMultiplier) < 1)) {
          toast.error('Same day multiplier must be at least 1.0');
          return skill;
        }
        
        if ('emergencyMultiplier' in updates && (isNaN(Number(updates.emergencyMultiplier)) || Number(updates.emergencyMultiplier) < 1)) {
          toast.error('Emergency multiplier must be at least 1.0');
          return skill;
        }
        
        return updatedSkill;
      }
      return skill;
    });
    onSkillsChange(updatedSkills);
  };

  const removeSkill = (index: number) => {
    const skillToRemove = selectedSkills[index];
    const updatedSkills = selectedSkills.filter((_, i) => i !== index);
    onSkillsChange(updatedSkills);
    toast.success(`Removed skill: ${skillToRemove.skillName}`);
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Beginner': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Skill - Simplified without pricing */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add New Skill</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Skill Name</Label>
                <Input
                  placeholder="Enter skill name (e.g., Plumbing, Electrical Work)"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewSkill()}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Experience Level</Label>
                <Select
                  value={newSkillExperience}
                  onValueChange={(value) => setNewSkillExperience(value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={addNewSkill} disabled={!newSkillName.trim()} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Note: Pricing for this skill can be configured after adding it to your profile.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Skills List */}
      <div className="space-y-4">
        {selectedSkills.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <DollarSign className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Skills Added Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Add your skills and experience levels to start building your profile
                  </p>
                  {isEditing && (
                    <Button onClick={() => setNewSkillName('General Handyman')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          selectedSkills.map((skill, index) => (
            <Card key={index} className={`transition-all border-2 ${skill.isActive ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50/30'}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Skill Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-semibold text-lg">{skill.skillName}</h3>
                        <Badge className={getExperienceColor(skill.experienceLevel)}>
                          {skill.experienceLevel}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {isEditing && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`active-${index}`} className="text-sm">Active</Label>
                            <Switch
                              id={`active-${index}`}
                              checked={skill.isActive}
                              onCheckedChange={(checked) => updateSkill(index, { isActive: checked })}
                            />
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSkill(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Skill Configuration - Only Experience Level for new skills */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Experience Level</Label>
                      <Select
                        value={skill.experienceLevel}
                        onValueChange={(value) => updateSkill(index, { experienceLevel: value as any })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Show pricing fields only if they have values (existing skills) */}
                    {skill.hourlyRate > 0 && (
                      <>
                        <div>
                          <Label className="text-sm font-medium">Base Rate ($/hr)</Label>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-sm">$</span>
                            <Input
                              type="number"
                              value={skill.hourlyRate}
                              onChange={(e) => updateSkill(index, { hourlyRate: parseFloat(e.target.value) || 0 })}
                              disabled={!isEditing}
                              min="0"
                              step="5"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Minimum Hours</Label>
                          <Input
                            type="number"
                            value={skill.minimumHours || 1}
                            onChange={(e) => updateSkill(index, { minimumHours: parseFloat(e.target.value) || 1 })}
                            disabled={!isEditing}
                            min="0.5"
                            step="0.5"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Same Day Multiplier</Label>
                          <Input
                            type="number"
                            value={skill.sameDayMultiplier || 1.5}
                            onChange={(e) => updateSkill(index, { sameDayMultiplier: parseFloat(e.target.value) || 1.5 })}
                            disabled={!isEditing}
                            min="1"
                            step="0.1"
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Emergency Multiplier Row - Only if pricing exists */}
                  {skill.hourlyRate > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Emergency Multiplier</Label>
                        <Input
                          type="number"
                          value={skill.emergencyMultiplier || 2.0}
                          onChange={(e) => updateSkill(index, { emergencyMultiplier: parseFloat(e.target.value) || 2.0 })}
                          disabled={!isEditing}
                          min="1"
                          step="0.1"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {/* Pricing Preview - Only show if pricing is configured */}
                  {skill.hourlyRate > 0 && (
                    <div className="bg-white rounded-lg border-2 border-gray-100 p-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Pricing Preview
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-lg font-bold text-green-700">
                            ${Number(skill.hourlyRate).toFixed(0)}/hr
                          </div>
                          <div className="text-sm text-green-600">Regular Rate</div>
                        </div>
                        
                        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="text-lg font-bold text-yellow-700 flex items-center justify-center">
                            <Clock className="w-4 h-4 mr-1" />
                            ${(Number(skill.hourlyRate) * Number(skill.sameDayMultiplier || 1.5)).toFixed(0)}/hr
                          </div>
                          <div className="text-sm text-yellow-600">Same Day</div>
                        </div>
                        
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="text-lg font-bold text-red-700 flex items-center justify-center">
                            <Zap className="w-4 h-4 mr-1" />
                            ${(Number(skill.hourlyRate) * Number(skill.emergencyMultiplier || 2.0)).toFixed(0)}/hr
                          </div>
                          <div className="text-sm text-red-600">Emergency</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message for new skills without pricing */}
                  {skill.hourlyRate === 0 && (
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                      <p className="text-sm text-blue-700">
                        💡 This skill has been added to your profile. You can configure pricing for this skill in the pricing management section.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
