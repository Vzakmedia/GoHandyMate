
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Users, Star, MapPin, Clock } from 'lucide-react';
import type { ServiceCategory, HandymanService } from './types';

interface SubservicesModalProps {
  category: ServiceCategory | null;
  onClose: () => void;
  onProfessionalsView: (subserviceName: string, services: HandymanService[]) => void;
}

export const SubservicesModal = ({ category, onClose, onProfessionalsView }: SubservicesModalProps) => {
  if (!category) return null;

  // Group services by subcategory
  const groupedServices = category.services.reduce((acc, service) => {
    const key = service.subcategory_name || service.category_name;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(service);
    return acc;
  }, {} as Record<string, HandymanService[]>);

  const Icon = category.icon;

  return (
    <Dialog open={!!category} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${category.color} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                <p className="text-gray-600">Choose a specific service to see available professionals</p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {Object.entries(groupedServices).map(([subserviceName, services]) => {
            const avgPrice = Math.round(
              services.reduce((sum, s) => sum + (s.custom_price || s.base_price), 0) / services.length
            );
            const uniqueProfessionals = new Set(services.map(s => s.user_id)).size;

            return (
              <Card key={subserviceName} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{subserviceName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{uniqueProfessionals} professionals available</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {services.length} services available
                      </Badge>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        {uniqueProfessionals} professionals
                      </Badge>
                    </div>
                    
                    <Button 
                      onClick={() => onProfessionalsView(subserviceName, services)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      View Professionals
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
