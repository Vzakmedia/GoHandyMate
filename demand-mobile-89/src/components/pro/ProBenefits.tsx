import { DollarSign, Calendar, MapPin } from "lucide-react";

export const ProBenefits = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Earn More",
      description: "Set your own rates and keep 85% of what you earn. No hidden fees or surprise deductions.",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Calendar,
      title: "Flexible Schedule",
      description: "Work when you want, where you want. Accept jobs that fit your schedule and availability.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: MapPin,
      title: "Local Customers",
      description: "Get connected with customers in your area who need your specific skills and services.",
      gradient: "from-green-500 to-teal-600"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Join GoHandyMate?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the advantages of being part of our trusted professional network
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};