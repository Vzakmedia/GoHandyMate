
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, X, DollarSign } from 'lucide-react';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';

interface SelectedSkill {
  categoryId: string;
  categoryName: string;
  hourlyRate: number;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  isActive: boolean;
}

interface EnhancedSkillSelectorProps {
  selectedSkills: SelectedSkill[];
  onSkillsChange: (skills: SelectedSkill[]) => void;
  isEditing: boolean;
}

export const EnhancedSkillSelector = ({
  selectedSkills,
  onSkillsChange,
  isEditing
}: EnhancedSkillSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const isSkillSelected = (categoryId: string) => {
    return selectedSkills.some(skill => skill.categoryId === categoryId);
  };

  const handleSkillToggle = (categoryId: string, categoryName: string) => {
    const isSelected = isSkillSelected(categoryId);
    
    if (isSelected) {
      // Remove skill
      onSkillsChange(selectedSkills.filter(skill => skill.categoryId !== categoryId));
    } else {
      // Add skill
      const newSkill: SelectedSkill = {
        categoryId,
        categoryName,
        hourlyRate: 45,
        experienceLevel: 'Intermediate',
        isActive: true
      };
      onSkillsChange([...selectedSkills, newSkill]);
    }
  };

  const updateSkillRate = (categoryId: string, newRate: number) => {
    onSkillsChange(selectedSkills.map(skill =>
      skill.categoryId === categoryId
        ? { ...skill, hourlyRate: newRate }
        : skill
    ));
  };

  const updateSkillLevel = (categoryId: string, newLevel: 'Beginner' | 'Intermediate' | 'Expert') => {
    onSkillsChange(selectedSkills.map(skill =>
      skill.categoryId === categoryId
        ? { ...skill, experienceLevel: newLevel }
        : skill
    ));
  };

  const removeSkill = (index: number) => {
    onSkillsChange(selectedSkills.filter((_, i) => i !== index));
  };

  const filteredCategories = expandedServiceCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Selected Skills Summary */}
      {selectedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Your Selected Skills & Rates</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedSkills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{skill.categoryName}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge variant="outline">{skill.experienceLevel}</Badge>
                    <span className="text-sm text-gray-600">
                      ${skill.hourlyRate}/hr
                    </span>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={skill.experienceLevel}
                      onValueChange={(value) => updateSkillLevel(skill.categoryId, value as any)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">$</span>
                      <Input
                        type="number"
                        value={skill.hourlyRate}
                        onChange={(e) => updateSkillRate(skill.categoryId, parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skill Selection */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Select Your Skills & Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for services and skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Service Categories */}
            <div className="space-y-3">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                const categorySelected = isSkillSelected(category.id);

                return (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader className="hover:bg-gray-50 cursor-pointer transition-colors py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={categorySelected}
                            onCheckedChange={() => handleSkillToggle(category.id, category.name)}
                          />
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {category.subcategories.length} services
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
