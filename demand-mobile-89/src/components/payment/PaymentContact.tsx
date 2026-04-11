import { Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PaymentContact = () => {
  const navigate = useNavigate();

  const handleContactSupport = () => {
    navigate("/help-center");
  };

  const handleCall = () => {
    window.location.href = "tel:240-444-7350";
  };
  return (
    <div className="py-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-6">
          <Phone className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
          Our payment protection team is available 24/7 to assist you with any concerns or questions.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={handleContactSupport}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Contact Support
          </button>
          <button 
            onClick={handleCall}
            className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            Call: 240-444-7350
          </button>
        </div>
      </div>
    </div>
  );
};