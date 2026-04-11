
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ToolsAndEquipmentProps {
  tools: string[];
}

export const ToolsAndEquipment = ({ tools }: ToolsAndEquipmentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tools & Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tools.map((tool, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">{tool}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
