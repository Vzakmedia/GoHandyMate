
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';

interface Skill {
  name: string;
  rate: number;
  level: string;
}

interface HandymanServiceRatesProps {
  skills: Skill[];
  serviceName: string;
  handymanName: string;
  isExpanded: boolean;
  onExpandToggle: () => void;
}

export const HandymanServiceRates = ({ 
  skills, 
  serviceName, 
  handymanName, 
  isExpanded, 
  onExpandToggle 
}: HandymanServiceRatesProps) => {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onExpandToggle}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          {isExpanded ? 'Hide' : 'View'} All Service Rates
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">All Service Rates for {handymanName}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded border ${skill.name.toLowerCase().includes(serviceName.toLowerCase()) ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                <div>
                  <span className="font-medium text-sm">{skill.name}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {skill.level}
                  </Badge>
                  {skill.name.toLowerCase().includes(serviceName.toLowerCase()) && (
                    <Badge className="ml-1 text-xs bg-green-100 text-green-800">
                      Current Service
                    </Badge>
                  )}
                </div>
                <span className="font-semibold text-green-600">${skill.rate}/hour</span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
