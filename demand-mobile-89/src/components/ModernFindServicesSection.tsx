
import { RealTimeServiceSync } from './RealTimeServiceSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Clock } from 'lucide-react';

export const ModernFindServicesSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find Professional Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with skilled professionals in real-time. All pricing is live and updated instantly.
          </p>
          
          <div className="flex items-center justify-center space-x-6 mt-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <Search className="w-5 h-5" />
              <span className="text-sm">Real-time availability</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">Location-based</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Instant booking</span>
            </div>
          </div>
        </div>

        <RealTimeServiceSync />
      </div>
    </section>
  );
};
