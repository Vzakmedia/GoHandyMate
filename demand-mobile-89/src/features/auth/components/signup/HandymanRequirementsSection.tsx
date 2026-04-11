
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CreditCard, Upload, User } from 'lucide-react';
import { HandymanFormData } from './types';
import { formatSSN } from './utils/formatters';

interface HandymanRequirementsSectionProps {
  data: HandymanFormData;
  onUpdate: (field: keyof HandymanFormData, value: string | string[] | File | null) => void;
  onFileUpload: (file: File | null) => void;
}

export const HandymanRequirementsSection = ({ data, onUpdate, onFileUpload }: HandymanRequirementsSectionProps) => {
  const addSkill = () => {
    if (data.newSkill.trim() && !data.skills.includes(data.newSkill.trim())) {
      onUpdate('skills', [...data.skills, data.newSkill.trim()]);
      onUpdate('newSkill', '');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onUpdate('skills', data.skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-800 border-b pb-2 flex items-center">
        <User className="w-5 h-5 mr-2" />
        Handyman Requirements
      </h3>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Required for verification:</p>
            <p>• Social Security Number (SSN) for background check</p>
            <p>• Valid government-issued photo ID</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ssn">Social Security Number (SSN) *</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="ssn"
              type="text"
              placeholder="123-45-6789"
              value={data.ssn}
              onChange={(e) => onUpdate('ssn', formatSSN(e.target.value))}
              className="pl-10"
              maxLength={11}
              required
            />
          </div>
          <p className="text-xs text-gray-500">Required for background verification</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceYears">Years of Experience</Label>
          <Input
            id="experienceYears"
            type="number"
            placeholder="5"
            value={data.experienceYears}
            onChange={(e) => onUpdate('experienceYears', e.target.value)}
            min="0"
            max="50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="validId">Valid Photo ID * (Driver's License, State ID, Passport)</Label>
        <div className="relative">
          <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="validId"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => onFileUpload(e.target.files?.[0] || null)}
            className="pl-10"
            required
          />
        </div>
        <p className="text-xs text-gray-500">Accepted formats: JPG, PNG, PDF (max 10MB)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
        <Input
          id="hourlyRate"
          type="number"
          placeholder="25.00"
          value={data.hourlyRate}
          onChange={(e) => onUpdate('hourlyRate', e.target.value)}
          min="0"
          step="0.01"
        />
      </div>

      <div className="space-y-2">
        <Label>Skills & Specialties</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill (e.g., Plumbing, Electrical)"
            value={data.newSkill}
            onChange={(e) => onUpdate('newSkill', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <Button type="button" onClick={addSkill} variant="outline">Add</Button>
        </div>
        {data.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-green-200"
                onClick={() => removeSkill(skill)}
              >
                {skill} ×
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell customers about your experience and what makes you stand out..."
          value={data.bio}
          onChange={(e) => onUpdate('bio', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};
