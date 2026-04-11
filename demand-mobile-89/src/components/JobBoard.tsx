
import { useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Search } from "lucide-react";
import { JobFilters } from "@/components/handyman/job-board/JobFilters";

interface JobBoardProps {
  mockTasks: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    location: string;
    timeAgo: string;
    taskerCount: number;
    urgency: string;
  }>;
}

export const JobBoard = ({ mockTasks }: JobBoardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

  // Get unique values for filter options
  const categories = [...new Set(mockTasks.map(task => task.category))];
  const urgencyLevels = [...new Set(mockTasks.map(task => task.urgency))];
  const locations = [...new Set(mockTasks.map(task => task.location))];

  // Filter tasks based on selected criteria
  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
    const matchesUrgency = selectedUrgency === "all" || task.urgency === selectedUrgency;
    const matchesLocation = selectedLocation === "all" || task.location === selectedLocation;
    
    let matchesPrice = true;
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under50":
          matchesPrice = task.price < 50;
          break;
        case "50to100":
          matchesPrice = task.price >= 50 && task.price <= 100;
          break;
        case "over100":
          matchesPrice = task.price > 100;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesUrgency && matchesLocation && matchesPrice;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedUrgency("all");
    setSelectedLocation("all");
    setPriceRange("all");
  };

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedUrgency !== "all", 
    selectedLocation !== "all",
    priceRange !== "all"
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
          <p className="text-gray-600">{filteredTasks.length} jobs found</p>
        </div>
      </div>

      {/* Filters */}
      <JobFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedUrgency={selectedUrgency}
        onUrgencyChange={setSelectedUrgency}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        categories={categories}
        urgencyLevels={urgencyLevels}
        locations={locations}
        onClearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Urgent Jobs</p>
              <p className="text-xl font-bold">
                {filteredTasks.filter(task => task.urgency === "Today").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Avg. Pay</p>
              <p className="text-xl font-bold">
                ${Math.round(filteredTasks.reduce((sum, task) => sum + task.price, 0) / filteredTasks.length || 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Locations</p>
              <p className="text-xl font-bold">{locations.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-xl font-bold">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms to find more jobs.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};
