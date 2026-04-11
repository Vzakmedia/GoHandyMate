
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, X, Loader2 } from "lucide-react";
import { ResponsiveCard } from "@/components/ResponsiveCard";
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';

interface ServiceAreasManagerProps {
  isEditing: boolean;
  serviceAreas: string[];
  onServiceAreasChange: (areas: string[]) => void;
}

export const ServiceAreasManager = ({
  isEditing,
  serviceAreas,
  onServiceAreasChange
}: ServiceAreasManagerProps) => {
  const { user } = useAuth();
  const [newArea, setNewArea] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const addServiceArea = () => {
    if (newArea.trim() && !serviceAreas.includes(newArea.trim())) {
      const updatedAreas = [...serviceAreas, newArea.trim()];
      onServiceAreasChange(updatedAreas);
      setNewArea('');
      toast.success('Service area added. Click Save to apply changes.');
    }
  };

  const removeServiceArea = (index: number) => {
    const updatedAreas = serviceAreas.filter((_, i) => i !== index);
    onServiceAreasChange(updatedAreas);
    toast.success('Service area removed. Click Save to apply changes.');
  };

  return (
    <ResponsiveCard title="Service Areas">
      <div className="space-y-4">
        {serviceAreas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {serviceAreas.map((area, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="flex items-center space-x-2 bg-blue-50 text-blue-800 border-blue-200 text-xs sm:text-sm px-2 sm:px-3 py-1"
              >
                <MapPin className="w-3 h-3" />
                <span>{area}</span>
                {isEditing && (
                  <button
                    onClick={() => removeServiceArea(index)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    disabled={isUpdating}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No service areas defined</p>
        )}

        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t">
            <Input
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="Add service area (e.g., Downtown, Suburbs)"
              className="flex-1 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addServiceArea()}
              disabled={isUpdating}
            />
            <Button 
              onClick={addServiceArea}
              size="sm"
              className="w-full sm:w-auto"
              disabled={isUpdating || !newArea.trim()}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Area
            </Button>
          </div>
        )}
      </div>
    </ResponsiveCard>
  );
};
