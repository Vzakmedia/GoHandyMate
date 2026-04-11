import { Filter } from "lucide-react";

interface ReviewsFiltersProps {
  ratingFilter: number | null;
  onFilterChange: (rating: number | null) => void;
}

export const ReviewsFilters = ({ ratingFilter, onFilterChange }: ReviewsFiltersProps) => {
  return (
    <div className="py-8 bg-white border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap gap-4 items-center">
          <button 
            onClick={() => onFilterChange(null)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              ratingFilter === null ? 'bg-primary text-primary-foreground' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Filter size={16} />
            <span>All Reviews</span>
          </button>
          <button 
            onClick={() => onFilterChange(5)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              ratingFilter === 5 ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-gray-50'
            }`}
          >
            5 Stars
          </button>
          <button 
            onClick={() => onFilterChange(4)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              ratingFilter === 4 ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-gray-50'
            }`}
          >
            4 Stars
          </button>
          <button 
            onClick={() => onFilterChange(3)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              ratingFilter === 3 ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-gray-50'
            }`}
          >
            3 Stars
          </button>
        </div>
      </div>
    </div>
  );
};