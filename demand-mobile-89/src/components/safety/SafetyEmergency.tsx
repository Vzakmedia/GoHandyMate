import { AlertTriangle } from "lucide-react";

export const SafetyEmergency = () => {
  const handleEmergencyCall = () => {
    window.location.href = "tel:911";
  };

  return (
    <div className="py-20 bg-gradient-to-br from-red-50 to-orange-50 border-t border-red-200/50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-900 to-red-700 bg-clip-text text-transparent">
              Emergency & Safety Concerns
            </h2>
          </div>
          <p className="text-red-700 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
            If you're experiencing an immediate safety concern or emergency situation, call 911 right away.
          </p>
          <button 
            onClick={handleEmergencyCall}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Emergency Contact: 911
          </button>
        </div>
      </div>
    </div>
  );
};