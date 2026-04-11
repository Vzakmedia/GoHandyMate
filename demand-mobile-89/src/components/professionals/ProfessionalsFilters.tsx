
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ProfessionalsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'rating' | 'distance' | 'experience';
  setSortBy: (sort: 'rating' | 'distance' | 'experience') => void;
  resultsCount: number;
}

export const ProfessionalsFilters = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  resultsCount
}: ProfessionalsFiltersProps) => {
  return (
    <div className="bg-white rounded-[2rem] border border-black/5 p-8 space-y-6">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#166534]">Search Experts</label>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors w-5 h-5" />
          <Input
            placeholder="Name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-[#FAFAF5] border-black/5 rounded-2xl font-medium focus-visible:ring-green-600 focus-visible:ring-offset-0 transition-all"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-black/5">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#166534]">Sort By</label>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full h-14 bg-white border-black/5 rounded-2xl font-black text-sm uppercase tracking-wider focus:ring-green-600">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-black/5">
            <SelectItem value="rating" className="py-3 font-bold">Highest Rated</SelectItem>
            <SelectItem value="distance" className="py-3 font-bold">Nearest</SelectItem>
            <SelectItem value="experience" className="py-3 font-bold">Most Experienced</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center justify-between px-2 pt-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Results</span>
          <span className="text-sm font-black text-[#0A0A0A]">{resultsCount} Professionals</span>
        </div>
      </div>
    </div>
  );
};
