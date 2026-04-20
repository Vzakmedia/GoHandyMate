import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const GoHandyMateHero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-80 h-80 bg-green-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-yellow-200/25 rounded-full blur-3xl translate-y-1/2"></div>

        {/* Organic shapes */}
        <svg className="absolute top-0 right-0 w-full h-full opacity-10" viewBox="0 0 1000 1000" fill="none">
          <path d="M800,200 Q900,300 850,450 T750,600 Q650,700 500,650 T300,500 Q200,400 250,250 T450,150 Q600,100 800,200Z" fill="currentColor" className="text-green-600" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        {/* Professional Partnership Badge */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-600">Background-checked professionals</span>
            <span className="font-semibold text-green-600">100% Verified</span>
          </div>
        </div>

        {/* Main headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-[1.15] sm:leading-tight">
            Find trusted professionals
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">for every home need</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-2 sm:px-0">
            Connect with verified handymen in your area. From quick fixes to major renovations.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="relative flex shadow-sm hover:shadow-md transition-shadow rounded-full">
              <Input
                type="text"
                placeholder="What do you need help with?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-12 sm:h-14 text-base sm:text-lg px-6 rounded-l-full border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                className="h-12 sm:h-14 px-6 sm:px-8 rounded-r-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};