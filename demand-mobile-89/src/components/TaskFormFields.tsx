
import { MapPin, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskFormFieldsProps {
  formData: {
    title: string;
    description: string;
    category: string;
    budget: string;
    location: string;
    urgency: string;
  };
  validationErrors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

const categories = [
  'cleaning', 'handyman', 'painting', 'plumbing', 'electrical', 'hvac',
  'assembly', 'mounting', 'smart-home', 'moving', 'delivery'
];

const urgencyOptions = [
  { value: 'emergency', label: 'Emergency' },
  { value: 'same-day', label: 'Same Day' },
  { value: 'this-week', label: 'This Week' },
  { value: 'next-week', label: 'Next Week' },
  { value: 'flexible', label: 'Flexible' }
];

export const TaskFormFields = ({ formData, validationErrors, onInputChange }: TaskFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="What do you need help with?"
          className={validationErrors.title ? 'border-red-500' : ''}
          maxLength={100}
        />
        {validationErrors.title && (
          <p className="text-sm text-red-600 mt-1">{validationErrors.title}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Provide more details about your task..."
          rows={4}
          className={validationErrors.description ? 'border-red-500' : ''}
          maxLength={1000}
        />
        {validationErrors.description && (
          <p className="text-sm text-red-600 mt-1">{validationErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => onInputChange('category', value)}
          >
            <SelectTrigger className={validationErrors.category ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.category && (
            <p className="text-sm text-red-600 mt-1">{validationErrors.category}</p>
          )}
        </div>

        <div>
          <Label htmlFor="budget">Budget ($) *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => onInputChange('budget', e.target.value)}
              placeholder="0.00"
              className={`pl-10 ${validationErrors.budget ? 'border-red-500' : ''}`}
              min="0"
              step="0.01"
            />
          </div>
          {validationErrors.budget && (
            <p className="text-sm text-red-600 mt-1">{validationErrors.budget}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onInputChange('location', e.target.value)}
            placeholder="Enter your location"
            className={`pl-10 ${validationErrors.location ? 'border-red-500' : ''}`}
            maxLength={100}
          />
        </div>
        {validationErrors.location && (
          <p className="text-sm text-red-600 mt-1">{validationErrors.location}</p>
        )}
      </div>

      <div>
        <Label htmlFor="urgency">When do you need this done? *</Label>
        <Select
          value={formData.urgency}
          onValueChange={(value) => onInputChange('urgency', value)}
        >
          <SelectTrigger className={validationErrors.urgency ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select urgency" />
          </SelectTrigger>
          <SelectContent>
            {urgencyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {validationErrors.urgency && (
          <p className="text-sm text-red-600 mt-1">{validationErrors.urgency}</p>
        )}
      </div>
    </>
  );
};
