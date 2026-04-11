
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface ServicesOfferedProps {
  formData: any;
  setFormData: (data: any) => void;
  isEditing: boolean;
  newService: string;
  setNewService: (value: string) => void;
  addItem: (type: 'service' | 'certification' | 'area', value: string) => void;
  removeItem: (type: 'service' | 'certification' | 'area', index: number) => void;
}

export const ServicesOffered = ({
  formData,
  setFormData,
  isEditing,
  newService,
  setNewService,
  addItem,
  removeItem
}: ServicesOfferedProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Offered</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.specialties.map((specialty: string, index: number) => (
                <div key={index} className="bg-blue-50 rounded-lg p-2 flex items-center space-x-2">
                  <span className="text-blue-900">{specialty}</span>
                  <button
                    onClick={() => removeItem('service', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Add new service"
                onKeyPress={(e) => e.key === 'Enter' && addItem('service', newService)}
              />
              <Button onClick={() => addItem('service', newService)} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {formData.specialties.map((specialty: string, index: number) => (
              <div key={index} className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="font-medium text-blue-900">{specialty}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
