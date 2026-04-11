import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

export const ReviewsCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of satisfied customers and find the perfect professional for your next project.
        </p>
        <button 
          onClick={() => navigate('/services')}
          className="bg-white text-gray-900 px-12 py-4 rounded-lg font-extrabold hover:bg-gray-50 transition-all duration-200 inline-flex items-center space-x-3 text-xl shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-primary/20"
        >
          <Calendar className="w-5 h-5" />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
};