export const ProProcess = () => {
  const steps = [
    {
      step: "1",
      title: "Create Profile",
      description: "Set up your professional profile with skills, experience, and service areas.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      step: "2", 
      title: "Get Verified",
      description: "Complete our verification process including background check and license verification.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      step: "3",
      title: "Receive Jobs",
      description: "Get notified of job opportunities that match your skills and location.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      step: "4",
      title: "Get Paid",
      description: "Complete the job and get paid securely through our platform within 24 hours.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Simple steps to start earning with GoHandyMate
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <span className="text-2xl font-bold text-white">{step.step}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};