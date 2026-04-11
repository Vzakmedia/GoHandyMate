import { Shield, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";

export const PaymentFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: "Escrow Protection",
      description: "Your funds are held in a secure escrow account and only released when you're satisfied with the completed work.",
      benefits: [
        "Payments held until job completion",
        "Professional dispute resolution", 
        "Full refund if work isn't completed"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: CreditCard,
      title: "Secure Transactions",
      description: "All payments are processed through encrypted, PCI-compliant payment systems with bank-level security.",
      benefits: [
        "256-bit SSL encryption",
        "PCI DSS compliant",
        "Fraud detection and prevention"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: AlertTriangle,
      title: "Dispute Resolution",
      description: "If issues arise, our dedicated support team helps resolve disputes fairly and quickly.",
      benefits: [
        "24/7 customer support",
        "Professional mediation",
        "Fair resolution process"
      ],
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: CheckCircle,
      title: "Quality Guarantee", 
      description: "We guarantee the quality of work performed by verified professionals on our platform.",
      benefits: [
        "Licensed and insured professionals",
        "Background checked providers",
        "Customer satisfaction guarantee"
      ],
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Your Protection Benefits</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive coverage for peace of mind on every project
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">{feature.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-3">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};