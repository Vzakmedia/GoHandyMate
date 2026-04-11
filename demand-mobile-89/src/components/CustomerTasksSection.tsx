
import { CheckCircle, Star, Calendar, MapPin } from "lucide-react";

interface CompletedJob {
  id: number;
  title: string;
  description: string;
  category: string;
  completedPrice: number;
  location: string;
  completedDate: string;
  professionalName: string;
  professionalAvatar: string;
  professionalRating: number;
  customerRating?: number;
}

interface CustomerTasksSectionProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
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

export const CustomerTasksSection = ({ 
  selectedCategory, 
  setSelectedCategory, 
  mockTasks 
}: CustomerTasksSectionProps) => {
  // Mock completed jobs data
  const completedJobs: CompletedJob[] = [
    {
      id: 1,
      title: "Kitchen Faucet Repair",
      description: "Fixed leaky kitchen faucet and checked water pressure",
      category: "Plumbing",
      completedPrice: 125,
      location: "Downtown Apartment",
      completedDate: "2024-06-15",
      professionalName: "Mike Rodriguez",
      professionalAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      professionalRating: 4.8,
      customerRating: 5
    },
    {
      id: 2,
      title: "Living Room Paint Touch-up",
      description: "Touched up paint on living room walls after furniture move",
      category: "Painting",
      completedPrice: 85,
      location: "Midtown House",
      completedDate: "2024-06-12",
      professionalName: "Emily Chen",
      professionalAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      professionalRating: 4.9,
      customerRating: 4
    },
    {
      id: 3,
      title: "Furniture Assembly",
      description: "Assembled IKEA dining table and chairs",
      category: "Handyman",
      completedPrice: 75,
      location: "Downtown Apartment",
      completedDate: "2024-06-08",
      professionalName: "David Kim",
      professionalAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      professionalRating: 4.7,
      customerRating: 5
    }
  ];

  const filteredJobs = selectedCategory 
    ? completedJobs.filter(job => job.category === selectedCategory)
    : completedJobs;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {selectedCategory ? `Recent ${selectedCategory} Jobs` : 'Recent Completed Jobs'}
        </h2>
        {selectedCategory && (
          <button 
            onClick={() => setSelectedCategory(null)}
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors self-start sm:self-center"
          >
            View All
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{job.title}</h3>
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{job.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>Completed {new Date(job.completedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 text-right flex-shrink-0">
                  <div className="text-lg sm:text-xl font-bold text-green-600">${job.completedPrice}</div>
                  <div className="text-xs text-gray-500">Paid</div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={job.professionalAvatar}
                    alt={job.professionalName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-sm text-gray-900">{job.professionalName}</div>
                    <div className="flex items-center space-x-1">
                      {renderStars(job.professionalRating)}
                      <span className="text-xs text-gray-500 ml-1">
                        {job.professionalRating}
                      </span>
                    </div>
                  </div>
                </div>
                
                {job.customerRating && (
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Your Rating:</div>
                    <div className="flex items-center space-x-1">
                      {renderStars(job.customerRating)}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button className="flex-1 px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                  View Details
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Book Again
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
