import { CreditCard, Shield, Clock, CheckCircle } from "lucide-react";

export const PaymentProcess = () => {
  const steps = [
    {
      icon: CreditCard,
      title: "1. Secure Payment",
      description: "Pay securely through our platform using credit card, debit card, or bank transfer.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "2. Funds Held",
      description: "Your payment is held securely in escrow until the work is completed to your satisfaction.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Clock,
      title: "3. Work Completed",
      description: "Professional completes the work according to the agreed specifications and timeline.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: CheckCircle,
      title: "4. Payment Released",
      description: "Once you approve the work, payment is released to the professional.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">How Our Payment Protection Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Simple, secure, and transparent - your money is always protected
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
              <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <step.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};