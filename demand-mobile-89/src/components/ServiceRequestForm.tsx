import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, MapPin, Calendar, DollarSign, X, Clock, User, Phone, Mail } from 'lucide-react';
import { serviceRequestSchema, validateFileUpload } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

interface ServiceRequestFormProps {
  onClose: () => void;
  onSubmit: (request: any) => void;
}

export const ServiceRequestForm = ({ onClose, onSubmit }: ServiceRequestFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    images: [] as string[],
    location: '',
    propertyType: '',
    scheduledDate: '',
    timePreference: '',
    urgency: '',
    estimatedPrice: 0,
    contact: {
      name: '',
      phone: '',
      email: '',
      alternateContact: ''
    },
    additionalInfo: {
      accessInstructions: '',
      specialRequirements: '',
      materialsProvided: false
    }
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const categoryGroups = {
    'Home Maintenance': [
      { value: 'cleaning', label: 'Cleaning Services', subcategories: ['Deep Cleaning', 'Regular Cleaning', 'Move-in/Move-out', 'Post-Construction'] },
      { value: 'handyman', label: 'General Handyman', subcategories: ['Minor Repairs', 'Maintenance', 'Installation', 'Troubleshooting'] },
      { value: 'painting', label: 'Painting', subcategories: ['Interior Painting', 'Exterior Painting', 'Touch-ups', 'Wallpaper'] }
    ],
    'Technical Services': [
      { value: 'plumbing', label: 'Plumbing', subcategories: ['Leak Repair', 'Drain Cleaning', 'Fixture Installation', 'Emergency Plumbing'] },
      { value: 'electrical', label: 'Electrical', subcategories: ['Outlet Installation', 'Light Fixtures', 'Wiring', 'Panel Upgrades'] },
      { value: 'hvac', label: 'HVAC', subcategories: ['AC Repair', 'Heating', 'Ventilation', 'Maintenance'] }
    ],
    'Assembly & Installation': [
      { value: 'assembly', label: 'Furniture Assembly', subcategories: ['IKEA Assembly', 'Custom Furniture', 'Office Furniture', 'Outdoor Furniture'] },
      { value: 'mounting', label: 'TV & Mounting', subcategories: ['TV Wall Mount', 'Shelf Installation', 'Picture Hanging', 'Mirror Mounting'] },
      { value: 'smart-home', label: 'Smart Home Setup', subcategories: ['Security Systems', 'Smart Lighting', 'Thermostats', 'Audio/Video'] }
    ],
    'Moving & Delivery': [
      { value: 'moving', label: 'Moving Services', subcategories: ['Local Moving', 'Heavy Lifting', 'Packing', 'Storage'] },
      { value: 'delivery', label: 'Delivery & Pickup', subcategories: ['Furniture Delivery', 'Appliance Delivery', 'Pickup Services', 'Same-day Delivery'] }
    ]
  };

  const propertyTypes = ['Apartment', 'House', 'Condo', 'Townhouse', 'Office', 'Commercial'];
  const urgencyLevels = [
    { value: 'emergency', label: 'Emergency (ASAP)', color: 'text-red-600' },
    { value: 'same-day', label: 'Same Day', color: 'text-orange-600' },
    { value: 'this-week', label: 'This Week', color: 'text-yellow-600' },
    { value: 'next-week', label: 'Next Week', color: 'text-blue-600' },
    { value: 'flexible', label: 'Flexible', color: 'text-green-600' }
  ];

  const timeSlots = [
    'Morning (8 AM - 12 PM)',
    'Afternoon (12 PM - 5 PM)',
    'Evening (5 PM - 8 PM)',
    'Anytime'
  ];

  const getSubcategories = () => {
    if (!formData.category) return [];
    
    for (const group of Object.values(categoryGroups)) {
      const category = group.find(cat => cat.value === formData.category);
      if (category) return category.subcategories;
    }
    return [];
  };

  const validateForm = () => {
    try {
      serviceRequestSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
      }
      setValidationErrors(errors);
      
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFileUpload(file);
      
      if (!validation.isValid) {
        toast({
          title: "File Upload Error",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Process valid files here
    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) uploaded successfully.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Additional security: validate again before submission
      const validatedData = serviceRequestSchema.parse(formData);
      onSubmit(validatedData);
      onClose();
      
      toast({
        title: "Request Submitted",
        description: "Your service request has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateContactData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
    // Clear validation error for this field
    const fieldPath = `contact.${field}`;
    if (validationErrors[fieldPath]) {
      setValidationErrors(prev => ({ ...prev, [fieldPath]: '' }));
    }
  };

  const updateAdditionalInfo = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: { ...prev.additionalInfo, [field]: value }
    }));
    // Clear validation error for this field
    const fieldPath = `additionalInfo.${field}`;
    if (validationErrors[fieldPath]) {
      setValidationErrors(prev => ({ ...prev, [fieldPath]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Request Service (Secure)</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Service Details</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Service Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="What do you need help with?"
                  className={validationErrors.title ? 'border-red-500' : ''}
                  required
                />
                {validationErrors.title && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={formData.category} onValueChange={(value) => {
                    updateFormData('category', value);
                    updateFormData('subcategory', ''); // Reset subcategory
                  }}>
                    <SelectTrigger className={validationErrors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryGroups).map(([groupName, categories]) => (
                        <div key={groupName}>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                            {groupName}
                          </div>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.category && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.category}</p>
                  )}
                </div>

                {formData.category && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Specific Service</label>
                    <Select value={formData.subcategory} onValueChange={(value) => updateFormData('subcategory', value)}>
                      <SelectTrigger className={validationErrors.subcategory ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select specific service" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubcategories().map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.subcategory && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.subcategory}</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Detailed Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe your task in detail... Include any specific requirements, materials needed, or issues you're experiencing."
                  className={`h-32 ${validationErrors.description ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.description && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.description}</p>
                )}
              </div>
            </div>

            {/* Location & Property */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Location & Property</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <Input
                      value={formData.location}
                      onChange={(e) => updateFormData('location', e.target.value)}
                      placeholder="Enter your address"
                      className={validationErrors.location ? 'border-red-500' : ''}
                      required
                    />
                  </div>
                  {validationErrors.location && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <Select value={formData.propertyType} onValueChange={(value) => updateFormData('propertyType', value)}>
                    <SelectTrigger className={validationErrors.propertyType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.propertyType && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.propertyType}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Scheduling</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Date</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <Input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => updateFormData('scheduledDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={validationErrors.scheduledDate ? 'border-red-500' : ''}
                    />
                  </div>
                  {validationErrors.scheduledDate && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.scheduledDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time Preference</label>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <Select value={formData.timePreference} onValueChange={(value) => updateFormData('timePreference', value)}>
                      <SelectTrigger className={validationErrors.timePreference ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {validationErrors.timePreference && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.timePreference}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Urgency</label>
                  <Select value={formData.urgency} onValueChange={(value) => updateFormData('urgency', value)}>
                    <SelectTrigger className={validationErrors.urgency ? 'border-red-500' : ''}>
                      <SelectValue placeholder="How urgent?" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <span className={level.color}>{level.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.urgency && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.urgency}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium mb-2">Photos (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-1">Add photos to help providers understand your needs</p>
                <p className="text-xs text-gray-400 mb-2">JPG, PNG, WebP up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="mt-2"
                >
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <Input
                      value={formData.contact.name}
                      onChange={(e) => updateContactData('name', e.target.value)}
                      placeholder="Your full name"
                      className={validationErrors['contact.name'] ? 'border-red-500' : ''}
                      required
                    />
                  </div>
                  {validationErrors['contact.name'] && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors['contact.name']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <Input
                      value={formData.contact.phone}
                      onChange={(e) => updateContactData('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className={validationErrors['contact.phone'] ? 'border-red-500' : ''}
                      required
                    />
                  </div>
                  {validationErrors['contact.phone'] && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors['contact.phone']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) => updateContactData('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className={validationErrors['contact.email'] ? 'border-red-500' : ''}
                      required
                    />
                  </div>
                  {validationErrors['contact.email'] && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors['contact.email']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      value={formData.estimatedPrice}
                      onChange={(e) => updateFormData('estimatedPrice', Number(e.target.value))}
                      placeholder="Estimated budget"
                      min="0"
                      max="1000000"
                      className={validationErrors.estimatedPrice ? 'border-red-500' : ''}
                    />
                  </div>
                  {validationErrors.estimatedPrice && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.estimatedPrice}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Access Instructions</label>
                <Textarea
                  value={formData.additionalInfo.accessInstructions}
                  onChange={(e) => updateAdditionalInfo('accessInstructions', e.target.value)}
                  placeholder="How should the provider access your property? (gate codes, parking instructions, etc.)"
                  className={`h-20 ${validationErrors['additionalInfo.accessInstructions'] ? 'border-red-500' : ''}`}
                />
                {validationErrors['additionalInfo.accessInstructions'] && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors['additionalInfo.accessInstructions']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Requirements</label>
                <Textarea
                  value={formData.additionalInfo.specialRequirements}
                  onChange={(e) => updateAdditionalInfo('specialRequirements', e.target.value)}
                  placeholder="Any special tools, materials, or considerations needed?"
                  className={`h-20 ${validationErrors['additionalInfo.specialRequirements'] ? 'border-red-500' : ''}`}
                />
                {validationErrors['additionalInfo.specialRequirements'] && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors['additionalInfo.specialRequirements']}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="materialsProvided"
                  checked={formData.additionalInfo.materialsProvided}
                  onChange={(e) => updateAdditionalInfo('materialsProvided', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="materialsProvided" className="text-sm text-gray-700">
                  I will provide all necessary materials
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-3">
              Submit Secure Service Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
