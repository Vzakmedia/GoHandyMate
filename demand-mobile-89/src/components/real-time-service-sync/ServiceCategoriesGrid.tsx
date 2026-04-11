
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ServiceCategory } from './types';

interface ServiceCategoriesGridProps {
  serviceCategories: ServiceCategory[];
  onCategorySelect: (category: ServiceCategory) => void;
  onRefresh: () => void;
}

export const ServiceCategoriesGrid = ({
  serviceCategories,
  onCategorySelect,
  onRefresh
}: ServiceCategoriesGridProps) => {
  if (serviceCategories.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Services</h3>
          <p className="text-gray-600 mb-4">
            No active services are currently available. Services will appear here when handymen activate their pricing.
          </p>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3">
      {serviceCategories.map((category) => {
        const Icon = category.icon;
        
        return (
          <Card 
            key={category.id}
            className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 overflow-hidden shadow-lg hover:shadow-2xl"
            onClick={() => onCategorySelect(category)}
          >
            <CardContent className="p-3 relative">
              {/* Modern subtle background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              {/* 3D Enhanced Icon with vibrant colors and depth */}
              <div className={`relative z-10 w-10 h-10 rounded-xl ${category.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-all duration-300 mx-auto
                shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] 
                hover:shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.3)]
                bg-gradient-to-br from-current via-current to-gray-800/20
                border border-white/20
                transform-gpu hover:rotate-3 hover:-translate-y-1`}>
                <Icon 
                  className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] relative z-10" 
                  strokeWidth={3}
                  style={{
                    filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.4)) drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
                  }}
                />
                {/* 3D highlight effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-60"></div>
              </div>
              
              {/* Compact Content */}
              <div className="relative z-10 text-center">
                <h3 className="font-medium text-xs text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                  {category.name}
                </h3>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 h-4 text-[10px] shadow-sm">
                      {new Set(category.services.map(s => s.user_id)).size}
                    </Badge>
                    <span className="text-[10px] text-gray-500">pros</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
