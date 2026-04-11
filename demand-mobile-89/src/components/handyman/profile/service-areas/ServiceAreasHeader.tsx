
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface ServiceAreasHeaderProps {
  isEditing: boolean;
  saving: boolean;
  onSave: () => void;
}

export const ServiceAreasHeader = ({ isEditing, saving, onSave }: ServiceAreasHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Service Areas
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Set your work areas with real-time address suggestions
            </p>
          </div>
          {isEditing && (
            <Button onClick={onSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};
