
import { Users, Star, Shield, CheckCircle } from 'lucide-react';
import { useAppMetrics } from "@/hooks/useAppMetrics";

export const ModernStatsSection = () => {
  const { totalProfessionals, averageRating, totalReviews, satisfactionRate, loading } = useAppMetrics();

  // Helper function to format numbers with K/M suffix
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const stats = [
    {
      icon: Users,
      value: loading ? "..." : `${formatNumber(totalProfessionals)}+`,
      label: "Active Professionals",
      description: "Verified service providers",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Star,
      value: loading ? "..." : `${averageRating.toFixed(1)}/5`,
      label: "Average Rating",
      description: `From ${totalReviews} reviews`,
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: CheckCircle,
      value: loading ? "..." : `${satisfactionRate}%`,
      label: "Satisfaction Rate",
      description: "Happy customers",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      value: "100%",
      label: "Verified Pros",
      description: "Background checked",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-48 h-48 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our growing community of satisfied customers and professional service providers
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="relative group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                {/* Icon with gradient background */}
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Value */}
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                  {stat.label}
                </div>
                
                {/* Description */}
                <div className="text-xs sm:text-sm text-gray-600">
                  {stat.description}
                </div>

                {/* Hover effect background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
