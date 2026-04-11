import { Star } from "lucide-react";

export const ProStories = () => {
  const successStories = [
    {
      name: "Mike Johnson",
      trade: "Plumber",
      earnings: "$8,500/month",
      story: "Joined 6 months ago and now have a steady stream of customers. The platform makes it easy to manage my business.",
      rating: 4.9
    },
    {
      name: "Sarah Chen",
      trade: "Electrician", 
      earnings: "$12,000/month",
      story: "As a woman in the trades, this platform has given me opportunities I never had before. Customers trust the verification process.",
      rating: 5.0
    },
    {
      name: "Carlos Rodriguez",
      trade: "Handyman",
      earnings: "$6,200/month", 
      story: "Perfect for my part-time schedule. I can work evenings and weekends while keeping my day job.",
      rating: 4.8
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Success Stories</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Hear from professionals who are growing their business with us
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="font-semibold text-white">{story.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{story.name}</h3>
                  <p className="text-sm text-muted-foreground">{story.trade}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{story.rating}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm font-medium text-emerald-600">{story.earnings}</span>
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed">"{story.story}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};