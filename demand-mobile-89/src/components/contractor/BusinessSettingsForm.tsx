import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, Building2, Save, ImageIcon } from 'lucide-react';
import { useBusinessSettings, BusinessSettings } from '@/hooks/useBusinessSettings';
import { toast } from 'sonner';

export const BusinessSettingsForm = () => {
  const { settings, loading, saving, saveSettings, uploadLogo } = useBusinessSettings();
  const [formData, setFormData] = useState<Partial<BusinessSettings>>(settings || {});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (field: keyof BusinessSettings, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const logoUrl = await uploadLogo(file);
      
      if (logoUrl) {
        handleInputChange('business_logo_url', logoUrl);
        toast.success('Logo uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const success = await saveSettings(formData);
    if (success) {
      toast.success('Settings saved successfully');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading business settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="w-5 h-5" />
          <span>Business Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Upload */}
        <div className="space-y-2">
          <Label>Business Logo</Label>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={formData.business_logo_url} alt="Business Logo" />
              <AvatarFallback>
                <ImageIcon className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Logo'}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        {/* Business Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="business_name">Business Name *</Label>
            <Input
              id="business_name"
              value={formData.business_name || ''}
              onChange={(e) => handleInputChange('business_name', e.target.value)}
              placeholder="Your Business Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="business_email">Business Email</Label>
            <Input
              id="business_email"
              type="email"
              value={formData.business_email || ''}
              onChange={(e) => handleInputChange('business_email', e.target.value)}
              placeholder="business@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_phone">Business Phone</Label>
            <Input
              id="business_phone"
              value={formData.business_phone || ''}
              onChange={(e) => handleInputChange('business_phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_website">Website</Label>
            <Input
              id="business_website"
              value={formData.business_website || ''}
              onChange={(e) => handleInputChange('business_website', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Business Address */}
        <div className="space-y-2">
          <Label htmlFor="business_address">Business Address</Label>
          <Textarea
            id="business_address"
            value={formData.business_address || ''}
            onChange={(e) => handleInputChange('business_address', e.target.value)}
            placeholder="123 Main St, City, State, ZIP"
            rows={3}
          />
        </div>

        {/* License & Insurance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="license_number">License Number</Label>
            <Input
              id="license_number"
              value={formData.license_number || ''}
              onChange={(e) => handleInputChange('license_number', e.target.value)}
              placeholder="LIC123456"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurance_number">Insurance Number</Label>
            <Input
              id="insurance_number"
              value={formData.insurance_number || ''}
              onChange={(e) => handleInputChange('insurance_number', e.target.value)}
              placeholder="INS789012"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax_id">Tax ID</Label>
            <Input
              id="tax_id"
              value={formData.tax_id || ''}
              onChange={(e) => handleInputChange('tax_id', e.target.value)}
              placeholder="12-3456789"
            />
          </div>
        </div>

        {/* Pricing Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="default_labor_rate">Default Labor Rate ($)</Label>
            <Input
              id="default_labor_rate"
              type="number"
              min="0"
              step="0.01"
              value={formData.default_labor_rate || 50}
              onChange={(e) => handleInputChange('default_labor_rate', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_markup_percentage">Default Markup (%)</Label>
            <Input
              id="default_markup_percentage"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.default_markup_percentage || 20}
              onChange={(e) => handleInputChange('default_markup_percentage', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auto_quote_expiry_days">Quote Expiry (Days)</Label>
            <Input
              id="auto_quote_expiry_days"
              type="number"
              min="1"
              value={formData.auto_quote_expiry_days || 30}
              onChange={(e) => handleInputChange('auto_quote_expiry_days', parseInt(e.target.value) || 30)}
            />
          </div>
        </div>

        {/* Payment Terms */}
        <div className="space-y-2">
          <Label htmlFor="payment_terms">Payment Terms</Label>
          <Input
            id="payment_terms"
            value={formData.payment_terms || 'Net 30'}
            onChange={(e) => handleInputChange('payment_terms', e.target.value)}
            placeholder="Net 30"
          />
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-2">
          <Label htmlFor="terms_conditions">Terms & Conditions</Label>
          <Textarea
            id="terms_conditions"
            value={formData.terms_conditions || ''}
            onChange={(e) => handleInputChange('terms_conditions', e.target.value)}
            placeholder="Enter your terms and conditions..."
            rows={4}
          />
        </div>

        {/* Quote Footer */}
        <div className="space-y-2">
          <Label htmlFor="quote_footer">Quote Footer Message</Label>
          <Input
            id="quote_footer"
            value={formData.quote_footer || 'Thank you for your business!'}
            onChange={(e) => handleInputChange('quote_footer', e.target.value)}
            placeholder="Thank you for your business!"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            disabled={saving || uploading}
            className="min-w-32"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};