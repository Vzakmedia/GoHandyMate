
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SkillRateCardProps {
  skill: {
    id: string;
    name: string;
    price: number;
    type: 'skill_rate';
    experienceLevel?: string;
  };
  onBook: (skillName: string, price: number) => void;
}

export const SkillRateCard = ({ skill, onBook }: SkillRateCardProps) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-semibold text-gray-800">{skill.name}</h4>
        <Badge variant="secondary" className="text-xs mt-1">
          {skill.experienceLevel || 'Intermediate'}
        </Badge>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-blue-600">${skill.price}/hr</div>
        <div className="text-xs text-gray-500">hourly rate</div>
      </div>
    </div>
    
    <Button 
      onClick={() => onBook(skill.name, skill.price)}
      className="w-full bg-blue-600 hover:bg-blue-700"
      size="sm"
    >
      Book ${skill.price}/hr
    </Button>
  </div>
);
