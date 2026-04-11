
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface JobFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedUrgency: string;
  onUrgencyChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  categories: string[];
  urgencyLevels: string[];
  locations: string[];
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export const JobFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedUrgency,
  onUrgencyChange,
  selectedLocation,
  onLocationChange,
  priceRange,
  onPriceRangeChange,
  categories,
  urgencyLevels,
  locations,
  onClearFilters,
  activeFiltersCount
}: JobFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search jobs by title or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Urgency Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Urgency</label>
              <Select value={selectedUrgency} onValueChange={onUrgencyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  {urgencyLevels.map(urgency => (
                    <SelectItem key={urgency} value={urgency}>
                      {urgency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <Select value={selectedLocation} onValueChange={onLocationChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price Range</label>
              <Select value={priceRange} onValueChange={onPriceRangeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under50">Under $50</SelectItem>
                  <SelectItem value="50to100">$50 - $100</SelectItem>
                  <SelectItem value="over100">Over $100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters & Clear */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center justify-between pt-2 border-t gap-2">
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => onCategoryChange("all")} />
                  </Badge>
                )}
                {selectedUrgency !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedUrgency}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => onUrgencyChange("all")} />
                  </Badge>
                )}
                {selectedLocation !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedLocation}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => onLocationChange("all")} />
                  </Badge>
                )}
                {priceRange !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {priceRange === "under50" ? "Under $50" :
                     priceRange === "50to100" ? "$50-$100" : "Over $100"}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => onPriceRangeChange("all")} />
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
