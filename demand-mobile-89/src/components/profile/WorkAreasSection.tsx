
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface WorkArea {
  area_name: string;
  is_active: boolean;
}

interface WorkAreasSectionProps {
  workAreas: WorkArea[];
}

export const WorkAreasSection = ({ workAreas }: WorkAreasSectionProps) => {
  const activeAreas = workAreas?.filter(area => area.is_active) || [];
  
  if (activeAreas.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Service Areas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {activeAreas.map((area, index) => (
            <Badge key={index} variant="outline">
              {area.area_name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
