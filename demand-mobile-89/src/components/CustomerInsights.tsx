
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Users, TrendingUp, MessageSquare, Heart, ThumbsUp } from "lucide-react";

interface CustomerMetrics {
  totalCustomers: number;
  repeatCustomers: number;
  repeatRate: number;
  averageJobsPerCustomer: number;
  customerRetentionRate: number;
}

interface ReviewMetrics {
  totalReviews: number;
  averageRating: number;
  fiveStarReviews: number;
  fourStarReviews: number;
  threeStarReviews: number;
  twoStarReviews: number;
  oneStarReviews: number;
  responseRate: number;
}

interface TopCustomer {
  id: string;
  name: string;
  avatar: string;
  jobsCompleted: number;
  totalSpent: number;
  averageRating: number;
  lastJobDate: string;
}

interface RecentReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  jobTitle: string;
  date: string;
  responded: boolean;
}

export const CustomerInsights = () => {
  // Mock data - in real app this would come from API
  const customerMetrics: CustomerMetrics = {
    totalCustomers: 127,
    repeatCustomers: 42,
    repeatRate: 33.1,
    averageJobsPerCustomer: 1.8,
    customerRetentionRate: 78.2
  };

  const reviewMetrics: ReviewMetrics = {
    totalReviews: 86,
    averageRating: 4.8,
    fiveStarReviews: 68,
    fourStarReviews: 12,
    threeStarReviews: 4,
    twoStarReviews: 1,
    oneStarReviews: 1,
    responseRate: 94.2
  };

  const topCustomers: TopCustomer[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b587?w=50&h=50&fit=crop&crop=face",
      jobsCompleted: 8,
      totalSpent: 720,
      averageRating: 5.0,
      lastJobDate: "2024-06-20"
    },
    {
      id: "2", 
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      jobsCompleted: 6,
      totalSpent: 540,
      averageRating: 4.8,
      lastJobDate: "2024-06-18"
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      jobsCompleted: 5,
      totalSpent: 425,
      averageRating: 5.0,
      lastJobDate: "2024-06-15"
    }
  ];

  const recentReviews: RecentReview[] = [
    {
      id: "1",
      customerName: "Lisa Thompson",
      rating: 5,
      comment: "Outstanding work! Mike was professional, punctual, and fixed everything perfectly. Will definitely hire again.",
      jobTitle: "Kitchen Faucet Repair",
      date: "2024-06-20",
      responded: true
    },
    {
      id: "2",
      customerName: "David Park",
      rating: 4,
      comment: "Good work overall. Arrived on time and completed the job efficiently. Minor cleanup could have been better.",
      jobTitle: "Light Fixture Installation", 
      date: "2024-06-19",
      responded: false
    },
    {
      id: "3",
      customerName: "Jennifer Walsh",
      rating: 5,
      comment: "Excellent service! Very knowledgeable and explained everything clearly. Highly recommend!",
      jobTitle: "Ceiling Fan Installation",
      date: "2024-06-18",
      responded: true
    }
  ];

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

  const getRatingDistribution = () => {
    const total = reviewMetrics.totalReviews;
    return [
      { stars: 5, count: reviewMetrics.fiveStarReviews, percentage: (reviewMetrics.fiveStarReviews / total) * 100 },
      { stars: 4, count: reviewMetrics.fourStarReviews, percentage: (reviewMetrics.fourStarReviews / total) * 100 },
      { stars: 3, count: reviewMetrics.threeStarReviews, percentage: (reviewMetrics.threeStarReviews / total) * 100 },
      { stars: 2, count: reviewMetrics.twoStarReviews, percentage: (reviewMetrics.twoStarReviews / total) * 100 },
      { stars: 1, count: reviewMetrics.oneStarReviews, percentage: (reviewMetrics.oneStarReviews / total) * 100 }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerMetrics.totalCustomers}</div>
            <p className="text-xs text-gray-600">
              {customerMetrics.repeatCustomers} repeat customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerMetrics.repeatRate}%</div>
            <p className="text-xs text-gray-600">
              {customerMetrics.averageJobsPerCustomer} avg jobs/customer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Heart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerMetrics.customerRetentionRate}%</div>
            <p className="text-xs text-gray-600">
              Last 6 months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Response</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewMetrics.responseRate}%</div>
            <p className="text-xs text-gray-600">
              {reviewMetrics.totalReviews} total reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Distribution</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold">{reviewMetrics.averageRating}</div>
              <div className="flex">
                {renderStars(reviewMetrics.averageRating)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {getRatingDistribution().map((rating) => (
              <div key={rating.stars} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm">{rating.stars}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <Progress value={rating.percentage} className="flex-1 h-2" />
                <span className="text-sm text-gray-600 w-8">{rating.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Customers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                    {index + 1}
                  </div>
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-sm">{customer.name}</div>
                    <div className="text-xs text-gray-600">
                      {customer.jobsCompleted} jobs • ${customer.totalSpent}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(customer.averageRating)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Last: {new Date(customer.lastJobDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentReviews.map((review) => (
            <div key={review.id} className="border-l-4 border-blue-200 pl-4 py-2">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{review.customerName}</span>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {review.jobTitle}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {review.responded ? (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      Responded
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      Pending Response
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
              {!review.responded && (
                <button className="text-xs text-blue-600 hover:underline">
                  Respond to review
                </button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
