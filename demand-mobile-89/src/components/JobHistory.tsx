import { useState } from "react";
import { Calendar, MapPin, Clock, User, Star, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JobHistoryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'completed' | 'in-progress' | 'cancelled' | 'pending';
  providerName?: string;
  providerAvatar?: string;
  providerRating?: number;
  scheduledDate: string;
  completedDate?: string;
  location: string;
  totalCost?: number;
  estimatedCost: number;
  images?: string[];
  customerRating?: number;
  customerReview?: string;
  assigned_to_user_id?: string;
  profiles?: {
    full_name: string;
  };
}

export const JobHistory = () => {
  const [selectedJob, setSelectedJob] = useState<JobHistoryItem | null>(null);

  const jobHistory: JobHistoryItem[] = [
    {
      id: "1",
      title: "Kitchen Faucet Repair",
      category: "Plumbing",
      description: "Replace leaky kitchen faucet and check water pressure",
      status: "completed",
      providerName: "Mike Rodriguez",
      providerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      providerRating: 4.8,
      scheduledDate: "2024-06-15",
      completedDate: "2024-06-15",
      location: "Downtown Apartment",
      totalCost: 125,
      estimatedCost: 120,
      customerRating: 5,
      customerReview: "Excellent work! Mike was professional and fixed the issue quickly.",
      assigned_to_user_id: "provider-1",
      profiles: { full_name: "Mike Rodriguez" }
    },
    {
      id: "2",
      title: "Living Room Paint Touch-up",
      category: "Painting",
      description: "Touch up paint on living room walls after furniture move",
      status: "in-progress",
      providerName: "Emily Chen",
      providerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      providerRating: 4.9,
      scheduledDate: "2024-06-21",
      location: "Midtown House",
      estimatedCost: 85,
      assigned_to_user_id: "provider-2",
      profiles: { full_name: "Emily Chen" }
    },
    {
      id: "3",
      title: "Smart Thermostat Installation",
      category: "Electrical",
      description: "Install new smart thermostat and configure app",
      status: "pending",
      scheduledDate: "2024-06-25",
      location: "Uptown Condo",
      estimatedCost: 150,
      assigned_to_user_id: "provider-3",
      profiles: { full_name: "John Electrician" }
    },
    {
      id: "4",
      title: "Furniture Assembly",
      category: "Handyman",
      description: "Assemble IKEA dining table and chairs",
      status: "cancelled",
      scheduledDate: "2024-06-10",
      location: "Downtown Apartment",
      estimatedCost: 75
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

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
    <div className="space-y-4">
      {jobHistory.map((job) => (
        <Card key={job.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {job.category}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-3">{job.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(job.scheduledDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(job.status)}
                  <Badge className={getStatusColor(job.status)}>
                    {job.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="text-lg font-semibold text-green-600">
                  ${job.totalCost || job.estimatedCost}
                </div>
                {job.totalCost && job.totalCost !== job.estimatedCost && (
                  <div className="text-xs text-gray-500">
                    Est. ${job.estimatedCost}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {job.providerName && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={job.providerAvatar}
                    alt={job.providerName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-sm">{job.providerName}</div>
                    {job.providerRating && (
                      <div className="flex items-center space-x-1">
                        {renderStars(job.providerRating)}
                        <span className="text-xs text-gray-500 ml-1">
                          {job.providerRating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {job.status === 'in-progress' && (
                    <>
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        Track
                      </Button>
                    </>
                  )}
                  {job.status === 'completed' && (
                    <Button 
                      size="sm"
                      disabled
                      className="bg-gray-400 hover:bg-gray-400"
                    >
                      {job.customerRating ? 'Rated' : 'Rating Unavailable'}
                    </Button>
                  )}
                  {job.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      Modify
                    </Button>
                  )}
                </div>
              </div>
            )}

            {job.customerReview && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium">Your Review:</span>
                  {job.customerRating && (
                    <div className="flex items-center space-x-1">
                      {renderStars(job.customerRating)}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700">{job.customerReview}</p>
              </div>
            )}

            <div className="flex justify-between items-center mt-3">
              <Button variant="ghost" size="sm">
                View Details
              </Button>
              {job.status === 'completed' && (
                <Button variant="outline" size="sm">
                  Book Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
