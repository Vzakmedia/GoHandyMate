import { useNavigate } from "react-router-dom";

export const PopularArticles = () => {
  const navigate = useNavigate();

  const popularArticles = [
    {
      title: "How to write an effective job description",
      path: "/help/job-description-guide"
    },
    {
      title: "Understanding our payment protection policy", 
      path: "/help/payment-protection"
    },
    {
      title: "Tips for choosing the right professional",
      path: "/help/choosing-professional"
    },
    {
      title: "What to expect during your first booking",
      path: "/help/first-booking"
    },
    {
      title: "How to handle project changes and additional work",
      path: "/help/project-changes"
    },
    {
      title: "Resolving disputes and getting refunds",
      path: "/help/disputes-refunds"
    }
  ];

  const handleArticleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Popular Help Articles</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Most helpful resources for our users. Find detailed guides and step-by-step instructions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {popularArticles.map((article, index) => (
            <div 
              key={index} 
              className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleArticleClick(article.path)}
            >
              <h3 className="font-medium text-foreground hover:text-primary transition-colors leading-relaxed">
                {article.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};