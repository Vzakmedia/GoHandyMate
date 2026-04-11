
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AddressInput } from '@/components/ui/address-input';
import { Calendar, CreditCard } from 'lucide-react';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';
import { PropertyUnitSelector } from './PropertyUnitSelector';
import { CustomerPropertySelector } from './CustomerPropertySelector';
import { useAuth } from '@/features/auth';

interface BookingFormProps {
  formData: {
    service: string;
    description: string;
    preferredDate: string;
    preferredTime: string;
    location: string;
    estimatedHours: number;
    urgency: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  serviceName: string;
  serviceRate: number;
  estimatedCost: number;
  serviceFromUrl: string;
  categoryFromUrl: string;
}

export const BookingForm = ({
  formData,
  onFormDataChange,
  onSubmit,
  submitting,
  serviceName,
  serviceRate,
  estimatedCost,
  serviceFromUrl,
  categoryFromUrl
}: BookingFormProps) => {
  const { profile } = useAuth();
  const handleAddressSelect = (address: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
  }) => {
    onFormDataChange(prev => ({
      ...prev,
      location: address.formatted_address
    }));
  };

  const handlePropertyLocationSelect = (address: string, unitInfo?: string) => {
    const locationText = unitInfo ? `${address} - ${unitInfo}` : address;
    onFormDataChange(prev => ({
      ...prev,
      location: locationText
    }));
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Service Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Service type info banner */}
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-800">Service: {serviceName}</h4>
                <p className="text-sm text-green-600">Professional's rate: ${serviceRate}/hour</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-green-600">${serviceRate}</span>
                <p className="text-xs text-green-500">per hour</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service">Service Type *</Label>
              <Input
                id="service"
                value={formData.service || serviceName}
                onChange={(e) => onFormDataChange(prev => ({ ...prev, service: e.target.value }))}
                placeholder="Service type"
                required
                disabled={!!serviceFromUrl}
              />
            </div>

            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <select
                id="urgency"
                value={formData.urgency}
                onChange={(e) => onFormDataChange(prev => ({ ...prev, urgency: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="flexible">Flexible (Standard Rate)</option>
                <option value="same_day">Same Day (+50%)</option>
                <option value="emergency">Emergency (+100%)</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormDataChange(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please describe the work needed in detail..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <Input
                id="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => onFormDataChange(prev => ({ ...prev, preferredDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="preferredTime">Preferred Time</Label>
              <Input
                id="preferredTime"
                type="time"
                value={formData.preferredTime}
                onChange={(e) => onFormDataChange(prev => ({ ...prev, preferredTime: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="location">Service Location *</Label>

            {/* Property Manager Quick Selector */}
            {profile?.user_role === 'property_manager' && (
              <PropertyUnitSelector
                onLocationSelect={handlePropertyLocationSelect}
                selectedLocation={formData.location}
              />
            )}

            {/* Customer Quick Selector */}
            {profile?.user_role !== 'property_manager' && (
              <CustomerPropertySelector
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onLocationSelect={(address) => onFormDataChange((prev: any) => ({ ...prev, location: address }))}
                selectedLocation={formData.location}
              />
            )}

            <div>
              <Label htmlFor="address-input" className="text-sm text-gray-600">
                Or enter a different address:
              </Label>
              <AddressInput
                value={formData.location}
                onChange={(value) => onFormDataChange(prev => ({ ...prev, location: value }))}
                onAddressSelect={handleAddressSelect}
                placeholder="Enter full address where service is needed"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="estimatedHours">Estimated Hours</Label>
            <Input
              id="estimatedHours"
              type="number"
              min="0.5"
              step="0.5"
              value={formData.estimatedHours}
              onChange={(e) => onFormDataChange(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 1 }))}
            />
          </div>

          {/* Enhanced Cost Estimate */}
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Cost Estimate for {serviceName}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Professional's Rate: ${serviceRate}/hour × {formData.estimatedHours} hours</span>
                <span className="font-medium">${serviceRate * formData.estimatedHours}</span>
              </div>
              {formData.urgency !== 'flexible' && (
                <div className="flex justify-between text-orange-600">
                  <span>Urgency Multiplier ({formData.urgency === 'emergency' ? '+100%' : '+50%'})</span>
                  <span className="font-medium">+${Math.round(serviceRate * formData.estimatedHours * (formData.urgency === 'emergency' ? 1 : 0.5))}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t border-green-200 pt-2">
                <span>Total Estimate:</span>
                <span className="text-green-600">${estimatedCost}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600 bg-white p-2 rounded border">
              <p>✓ This rate is configured by the professional</p>
              <p>✓ Final cost may vary based on actual work completed</p>
              <p>✓ Payment is processed after service completion</p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : `Book ${serviceName} - $${estimatedCost}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
