import { Award } from "lucide-react";

interface ProCTAProps {
  onApply: () => void;
}

export const ProCTA = ({ onApply }: ProCTAProps) => {
  return (
    <div className="py-16 bg-gradient-to-br from-emerald-500 to-green-600 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-6">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of professionals earning on GoHandyMate. Start your application today.
        </p>
        <button 
          onClick={onApply}
          className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};