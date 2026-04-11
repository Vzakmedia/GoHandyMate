import { CheckCircle } from "lucide-react";

export const SafetyVerification = () => {
  const verificationSteps = [
    {
      icon: CheckCircle,
      title: "Identity Verification",
      description: "Government-issued ID and Social Security verification"
    },
    {
      icon: CheckCircle, 
      title: "Criminal Background Check",
      description: "National and local criminal history screening"
    },
    {
      icon: CheckCircle,
      title: "License & Insurance", 
      description: "Professional licenses and liability insurance verification"
    },
    {
      icon: CheckCircle,
      title: "Reference Checks",
      description: "Previous customer and professional reference validation"
    }
  ];

  const verificationStats = [
    { label: "Applications Reviewed", value: "25,000+" },
    { label: "Professionals Approved", value: "2,500+" },
    { label: "Approval Rate", value: "10%" },
    { label: "Average Screening Time", value: "5-7 days" }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-green-50/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-4 mb-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
                Professional Verification Process
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
            </div>
            <div className="space-y-6">
              {verificationSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="flex items-start">
                    <IconComponent className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Verification Stats</h3>
            <div className="space-y-4">
              {verificationStats.map((stat, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="font-semibold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};