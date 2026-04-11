
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Award, CheckCircle, Plus, X } from 'lucide-react';

interface LicensesCertificationsProps {
  formData: any;
  isEditing: boolean;
  newCertification: string;
  setNewCertification: (value: string) => void;
  addItem: (type: 'service' | 'certification' | 'area', value: string) => void;
  removeItem: (type: 'service' | 'certification' | 'area', index: number) => void;
}

export const LicensesCertifications = ({
  formData,
  isEditing,
  newCertification,
  setNewCertification,
  addItem,
  removeItem
}: LicensesCertificationsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="w-5 h-5 mr-2 text-blue-600" />
          Licenses & Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="font-medium text-green-800">License #{formData.licenseNumber}</div>
          <div className="text-sm text-green-600">General Contractor</div>
        </div>
        
        {isEditing ? (
          <div className="space-y-3">
            {formData.certifications.map((cert: string, index: number) => (
              <div key={index} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{cert}</span>
                </div>
                <button
                  onClick={() => removeItem('certification', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex space-x-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Add certification"
                onKeyDown={(e) => e.key === 'Enter' && addItem('certification', newCertification)}
              />
              <Button onClick={() => addItem('certification', newCertification)} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          formData.certifications.map((cert: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">{cert}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
