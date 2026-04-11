
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';

interface SkillsManagerProps {
  isEditing: boolean;
}

export const SkillsManager = ({ isEditing }: SkillsManagerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Service Categories</span>
          </div>
          <Badge variant="outline" className="w-fit">
            Pricing Focus
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Service pricing is now managed in the Service Categories section. Focus on setting competitive rates for your services.
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Note:</strong> Service pricing is managed in the Service Categories section where you can set rates for specific services and configure pricing multipliers.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
