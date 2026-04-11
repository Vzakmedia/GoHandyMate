
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Building, FileText, Upload, Award } from 'lucide-react';
import { ContractorFormData } from './types';
import { formatEIN } from './utils/formatters';

interface ContractorRequirementsSectionProps {
  data: ContractorFormData;
  onUpdate: (field: keyof ContractorFormData, value: string | string[] | File | null) => void;
  onFileUpload: (file: File | null, type: 'license' | 'insurance') => void;
}

export const ContractorRequirementsSection = ({ data, onUpdate, onFileUpload }: ContractorRequirementsSectionProps) => {
  const addService = () => {
    if (data.newService.trim() && !data.servicesOffered.includes(data.newService.trim())) {
      onUpdate('servicesOffered', [...data.servicesOffered, data.newService.trim()]);
      onUpdate('newService', '');
    }
  };

  const removeService = (serviceToRemove: string) => {
    onUpdate('servicesOffered', data.servicesOffered.filter(service => service !== serviceToRemove));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-800 border-b pb-2 flex items-center">
        <Building className="w-5 h-5 mr-2" />
        Contractor Requirements
      </h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Required for verification:</p>
            <p>• Employer Identification Number (EIN)</p>
            <p>• Business name and information</p>
            <p>• Professional licenses (if applicable)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="businessName"
              type="text"
              placeholder="Your Business Name LLC"
              value={data.businessName}
              onChange={(e) => onUpdate('businessName', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ein">Employer Identification Number (EIN) *</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="ein"
              type="text"
              placeholder="12-3456789"
              value={data.ein}
              onChange={(e) => onUpdate('ein', formatEIN(e.target.value))}
              className="pl-10"
              maxLength={10}
              required
            />
          </div>
          <p className="text-xs text-gray-500">Required for business verification</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Business Website</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://yourbusiness.com"
          value={data.website}
          onChange={(e) => onUpdate('website', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">License Number (Optional)</Label>
          <div className="relative">
            <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="licenseNumber"
              type="text"
              placeholder="Enter license number"
              value={data.licenseNumber}
              onChange={(e) => onUpdate('licenseNumber', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseFile">License Certificate (Optional)</Label>
          <div className="relative">
            <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="licenseFile"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => onFileUpload(e.target.files?.[0] || null, 'license')}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="insuranceFile">Insurance Certificate (Optional)</Label>
        <div className="relative">
          <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="insuranceFile"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => onFileUpload(e.target.files?.[0] || null, 'insurance')}
            className="pl-10"
          />
        </div>
        <p className="text-xs text-gray-500">Liability insurance certificate</p>
      </div>

      <div className="space-y-2">
        <Label>Services Offered</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a service (e.g., Kitchen Remodeling, Roofing)"
            value={data.newService}
            onChange={(e) => onUpdate('newService', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
          />
          <Button type="button" onClick={addService} variant="outline">Add</Button>
        </div>
        {data.servicesOffered.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.servicesOffered.map((service, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200"
                onClick={() => removeService(service)}
              >
                {service} ×
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessDescription">Business Description</Label>
        <Textarea
          id="businessDescription"
          placeholder="Describe your business, experience, and what sets you apart from competitors..."
          value={data.businessDescription}
          onChange={(e) => onUpdate('businessDescription', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};
