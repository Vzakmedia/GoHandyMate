
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Search, Star, Clock, DollarSign } from 'lucide-react';
import { expandedServiceCategories, type ExpandedServiceCategory, type ServiceSubcategory } from '@/data/expandedServiceCategories';

interface EnhancedServiceGridProps {
  onServiceSelect?: (categoryId: string, subcategoryId?: string) => void;
  onProfessionalSearch?: (service: string) => void;
  showPricing?: boolean;
  layout?: 'grid' | 'list';
}

export const EnhancedServiceGrid = ({ 
  onServiceSelect, 
  onProfessionalSearch,
  showPricing = true,
  layout = 'grid'
}: EnhancedServiceGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredCategories = expandedServiceCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSubcategorySelect = (category: ExpandedServiceCategory, subcategory: ServiceSubcategory) => {
    if (onServiceSelect) {
      onServiceSelect(category.id, subcategory.id);
    }
    if (onProfessionalSearch) {
      onProfessionalSearch(subcategory.name);
    }
  };

  const handleCategorySelect = (category: ExpandedServiceCategory) => {
    if (onServiceSelect) {
      onServiceSelect(category.id);
    }
    if (onProfessionalSearch) {
      onProfessionalSearch(category.name);
    }
  };

  if (layout === 'list') {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            const isExpanded = expandedCategories.includes(category.id);

            return (
              <Card key={category.id} className="overflow-hidden">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <CardHeader 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-gray-600 font-normal">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {category.subcategories.length} services
                          </Badge>
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.subcategories.map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleSubcategorySelect(category, subcategory)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-800">{subcategory.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{subcategory.description}</p>
                            <Button size="sm" variant="outline" className="w-full">
                              Find Professionals
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t">
                        <Button 
                          variant="ghost" 
                          className="w-full"
                          onClick={() => handleCategorySelect(category)}
                        >
                          View All {category.name} Professionals
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          
          return (
            <Card key={category.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-600 font-normal">{category.description}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {category.subcategories.slice(0, 3).map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="flex justify-between items-center p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleSubcategorySelect(category, subcategory)}
                    >
                      <div>
                        <p className="font-medium text-sm">{subcategory.name}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
                
                {category.subcategories.length > 3 && (
                  <div className="text-center pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCategorySelect(category)}
                    >
                      View All {category.subcategories.length} Services
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="outline" className="text-xs">
                    {category.subcategories.length} services
                  </Badge>
                  <Button 
                    size="sm"
                    onClick={() => handleCategorySelect(category)}
                  >
                    Find Professionals
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
