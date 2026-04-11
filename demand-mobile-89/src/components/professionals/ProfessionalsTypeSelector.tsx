
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench, Users } from 'lucide-react';

interface ProfessionalsTypeSelectorProps {
  selectedType: 'handyman' | 'contractor' | 'all';
  setSelectedType: (type: 'handyman' | 'contractor' | 'all') => void;
}

export const ProfessionalsTypeSelector = ({
  selectedType,
  setSelectedType
}: ProfessionalsTypeSelectorProps) => {
  return (
    <div className="mb-6">
      <Tabs value={selectedType} onValueChange={(value: any) => setSelectedType(value)} className="w-full">
        <TabsList className="flex w-full bg-white border border-black/5 rounded-2xl p-1.5 h-auto shadow-sm gap-2">
          <TabsTrigger
            value="all"
            className="flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-[#166534] data-[state=active]:text-white transition-all underline-none border-none"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="handyman"
            className="flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-[#166534] data-[state=active]:text-white transition-all underline-none border-none space-x-2"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Handyman</span>
          </TabsTrigger>
          <TabsTrigger
            value="contractor"
            className="flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-[#166534] data-[state=active]:text-white transition-all underline-none border-none space-x-2"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Contractors</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
