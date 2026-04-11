import { Phone } from "lucide-react";

export const EmergencyContact = () => {
  const handleEmergencyCall = () => {
    window.location.href = "tel:911";
  };

  return (
    <div className="py-16 bg-red-50 border-t border-red-200">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Phone className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-red-900 mb-4">Emergency Support</h2>
        <p className="text-red-700 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
          If you're experiencing a safety issue or emergency situation, contact 911 immediately
        </p>
        <button 
          onClick={handleEmergencyCall}
          className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors text-lg"
        >
          Emergency Contact: 911
        </button>
      </div>
    </div>
  );
};