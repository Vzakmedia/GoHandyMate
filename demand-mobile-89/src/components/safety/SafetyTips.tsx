export const SafetyTips = () => {
  const safetyTips = [
    {
      title: "Always Use the Platform",
      description: "Keep all communications and payments within GoHandyMate for protection and support."
    },
    {
      title: "Verify Professional Identity",
      description: "Ask to see ID and verify it matches their profile before work begins."
    },
    {
      title: "Trust Your Instincts", 
      description: "If something feels wrong, contact our support team immediately."
    },
    {
      title: "Secure Your Home",
      description: "Keep valuables secure and consider being present during the work."
    },
    {
      title: "Document Everything",
      description: "Take photos before and after work, and keep records of all communications."
    },
    {
      title: "Report Issues Promptly",
      description: "Contact us immediately if you experience any safety concerns or problems."
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
            Safety Tips for Customers
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Best practices to ensure a safe and successful experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safetyTips.map((tip, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{tip.title}</h3>
              <p className="text-gray-600 leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};