
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sanitizeText, serviceRequestSchema } from '@/lib/validation';

interface FormData {
  title: string;
  description: string;
  category: string;
  budget: string;
  location: string;
  urgency: string;
  contactMethod: string;
}

export const usePostTaskForm = (onSubmit: (taskData: any) => void, onClose: () => void) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
    urgency: '',
    contactMethod: 'phone'
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeText(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    try {
      const dataToValidate = {
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        subcategory: formData.category,
        location: formData.location,
        propertyType: 'residential',
        urgency: formData.urgency as any,
        estimatedPrice: parseFloat(formData.budget) || 0,
        contact: {
          name: 'User',
          phone: '555-0000',
          email: 'user@example.com'
        },
        additionalInfo: {
          materialsProvided: false
        }
      };
      
      serviceRequestSchema.parse(dataToValidate);
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
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const sanitizedData = {
        ...formData,
        title: sanitizeText(formData.title),
        description: sanitizeText(formData.description),
        location: sanitizeText(formData.location),
        budget: parseFloat(formData.budget)
      };
      
      await onSubmit(sanitizedData);
      
      toast({
        title: "Task Posted!",
        description: "Your task has been posted successfully.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    validationErrors,
    isSubmitting,
    handleInputChange,
    handleSubmit
  };
};
