import { Shield, Lock, Eye } from "lucide-react";

export const PaymentSecurity = () => {
  const securityMeasures = [
    {
      icon: Shield,
      title: "Bank-Level Encryption",
      description: "Your payment information is protected with the same encryption used by major banks.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Lock,
      title: "Fraud Prevention",
      description: "Advanced algorithms monitor transactions for suspicious activity and protect against fraud.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Eye,
      title: "Identity Verification",
      description: "All professionals are verified and background checked before joining our platform.",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Advanced Security Measures</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Multiple layers of protection keep your transactions safe
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {securityMeasures.map((measure, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
              <div className={`w-24 h-24 bg-gradient-to-r ${measure.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <measure.icon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">{measure.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {measure.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};