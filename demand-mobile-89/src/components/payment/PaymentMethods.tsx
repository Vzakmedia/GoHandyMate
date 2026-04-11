import { CreditCard, Smartphone, Building, Banknote } from "lucide-react";

export const PaymentMethods = () => {
  const methods = [
    { 
      name: "Credit Cards", 
      icon: CreditCard, 
      description: "Visa, Mastercard, American Express",
      gradient: "from-blue-500 to-indigo-600"
    },
    { 
      name: "Debit Cards", 
      icon: Building, 
      description: "All major debit cards accepted",
      gradient: "from-green-500 to-teal-600"
    },
    { 
      name: "Bank Transfer", 
      icon: Banknote, 
      description: "Direct bank account transfers",
      gradient: "from-purple-500 to-violet-600"
    },
    { 
      name: "Digital Wallets", 
      icon: Smartphone, 
      description: "Apple Pay, Google Pay, PayPal",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Accepted Payment Methods</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Pay with your preferred method - all are secured and protected
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {methods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${method.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{method.name}</h3>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};