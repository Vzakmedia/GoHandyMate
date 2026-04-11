import { TrendingUp, CheckCircle } from "lucide-react";

interface ProPricingProps {
  onStartApplication: () => void;
}

export const ProPricing = ({ onStartApplication }: ProPricingProps) => {
  const features = [
    "Keep 85% of every job payment",
    "No monthly or setup fees", 
    "Secure payment processing",
    "24/7 customer support",
    "Professional tools and resources"
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">
            No hidden fees, just straightforward pricing
          </p>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">Professional Plan</h3>
          <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">15%</div>
          <p className="text-muted-foreground mb-8">Platform fee on completed jobs</p>
          
          <div className="space-y-4 text-left mb-8 max-w-md mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
          
          <button 
            onClick={onStartApplication}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Start Your Application
          </button>
        </div>
      </div>
    </div>
  );
};