import { Shield, CheckCircle, Lock, Eye } from "lucide-react";

export const SafetyFeatures = () => {
  const safetyFeatures = [
    {
      icon: Shield,
      title: "Background Checks",
      description: "All professionals undergo comprehensive background screening including criminal history and identity verification."
    },
    {
      icon: CheckCircle,
      title: "License Verification", 
      description: "We verify professional licenses, certifications, and insurance coverage before approval."
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "All payments are processed securely and held in escrow until work is completed satisfactorily."
    },
    {
      icon: Eye,
      title: "Real-time Monitoring",
      description: "Our team monitors all interactions and can intervene if safety concerns arise."
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
            How We Keep You Safe
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Multiple layers of protection for your peace of mind
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {safetyFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-6 flex-shrink-0 shadow-lg">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};