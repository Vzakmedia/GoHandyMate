
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Building, Phone, MessageSquare } from 'lucide-react';

interface BusinessInformationProps {
  formData: any;
  setFormData: (data: any) => void;
  isEditing: boolean;
  profile: any;
}

export const BusinessInformation = ({
  formData,
  setFormData,
  isEditing,
  profile
}: BusinessInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="w-5 h-5 mr-2 text-blue-600" />
          Business Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Business Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="border-2 border-blue-300"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="border-2 border-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="https://yourwebsite.com"
                  className="border-2 border-blue-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">License Number</label>
                <Input
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  className="border-2 border-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Insurance Amount</label>
                <Input
                  value={formData.insuranceAmount}
                  onChange={(e) => setFormData({...formData, insuranceAmount: e.target.value})}
                  className="border-2 border-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bond Amount</label>
                <Input
                  value={formData.bondAmount}
                  onChange={(e) => setFormData({...formData, bondAmount: e.target.value})}
                  className="border-2 border-blue-300"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700">{formData.description}</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{formData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span>{profile?.email}</span>
              </div>
              {formData.website && (
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {formData.website}
                  </a>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-600">License</div>
                <div className="text-sm">{formData.licenseNumber}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Insurance</div>
                <div className="text-sm">${formData.insuranceAmount}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Bond</div>
                <div className="text-sm">${formData.bondAmount}</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
