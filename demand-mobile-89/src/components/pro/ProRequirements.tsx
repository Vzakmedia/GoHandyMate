import { CheckCircle } from "lucide-react";

export const ProRequirements = () => {
  const requirements = [
    {
      category: "Basic Requirements",
      items: [
        "18+ years old with valid ID",
        "Legal authorization to work in the US",
        "Reliable transportation",
        "Smartphone with internet access",
        "Clean background check"
      ]
    },
    {
      category: "Professional Requirements", 
      items: [
        "Relevant experience in your trade",
        "Required licenses and certifications",
        "General liability insurance",
        "Professional references",
        "Own tools and equipment"
      ]
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Requirements</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            What you need to join our professional network
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {requirements.map((req, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-foreground mb-6">{req.category}</h3>
              <ul className="space-y-4">
                {req.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
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