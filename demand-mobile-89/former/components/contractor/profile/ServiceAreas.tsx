
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Plus, X } from 'lucide-react';

interface ServiceAreasProps {
  formData: any;
  isEditing: boolean;
  newServiceArea: string;
  setNewServiceArea: (value: string) => void;
  addItem: (type: 'service' | 'certification' | 'area', value: string) => void;
  removeItem: (type: 'service' | 'certification' | 'area', index: number) => void;
}

export const ServiceAreas = ({
  formData,
  isEditing,
  newServiceArea,
  setNewServiceArea,
  addItem,
  removeItem
}: ServiceAreasProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Service Areas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            {formData.serviceAreas.map((area: string, index: number) => (
              <div key={index} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">{area}</span>
                </div>
                <button
                  onClick={() => removeItem('area', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex space-x-2">
              <Input
                value={newServiceArea}
                onChange={(e) => setNewServiceArea(e.target.value)}
                placeholder="Add service area"
                onKeyDown={(e) => e.key === 'Enter' && addItem('area', newServiceArea)}
              />
              <Button onClick={() => addItem('area', newServiceArea)} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {formData.serviceAreas.map((area: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">{area}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
