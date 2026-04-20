
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCustomerReviews } from '@/hooks/useCustomerReviews';

type TestimonialData = {
  id: string;
  rating: number;
  review_text: string;
  customer_name: string;
  customer_location: string;
  created_at: string;
};

export const ModernTestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { reviews, loading } = useCustomerReviews(6);

  // Fallback testimonials if no real reviews are available
  const fallbackTestimonials: TestimonialData[] = [
    {
      id: "1",
      rating: 5,
      review_text: "GoHandyMate connected me with an amazing plumber who fixed my kitchen leak in under 2 hours. Professional, affordable, and reliable!",
      customer_name: "Sarah Johnson",
      customer_location: "Los Angeles, CA",
      created_at: new Date().toISOString(),
    },
    {
      id: "2", 
      rating: 5,
      review_text: "I have multiple rental units and GoHandyMate makes finding reliable handymen so much easier. Same-day service is a game changer!",
      customer_name: "Mike Chen",
      customer_location: "San Francisco, CA", 
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      rating: 5,
      review_text: "The electrical work for my restaurant was completed perfectly and on time. The professional was courteous and extremely skilled.",
      customer_name: "Jessica Martinez",
      customer_location: "Austin, TX",
      created_at: new Date().toISOString(),
    }
  ];

  // Use real reviews if available, otherwise fallback to mock data
  const testimonials: TestimonialData[] = reviews.length > 0 ? reviews.slice(0, 3) : fallbackTestimonials;

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Helper function to determine service category from review text
  const getServiceCategory = (reviewText: string) => {
    const text = reviewText.toLowerCase();
    if (text.includes('plumb') || text.includes('leak') || text.includes('pipe')) return 'Plumbing';
    if (text.includes('electric') || text.includes('wiring') || text.includes('outlet')) return 'Electrical';
    if (text.includes('paint') || text.includes('wall') || text.includes('color')) return 'Painting';
    if (text.includes('repair') || text.includes('fix') || text.includes('maintenance')) return 'General Maintenance';
    return 'Home Service';
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Subtle Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-green-500/30">
            <Quote className="w-4 h-4" />
            <span>Customer Stories</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Real experiences from our satisfied customers
          </p>
        </div>

        {/* Compact Testimonial Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === currentTestimonial 
                    ? 'opacity-100 transform translate-x-0' 
                    : 'opacity-0 transform translate-x-full absolute inset-0'
                }`}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-xl">
                  {/* Compact Quote Icon */}
                  <div className="text-center mb-6">
                    <Quote className="w-8 h-8 text-green-400 mx-auto opacity-60" />
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-lg sm:text-xl text-white leading-relaxed text-center mb-6 italic">
                    "{testimonial.review_text}"
                  </blockquote>

                  {/* Compact Rating */}
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Compact Author Info */}
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                      {getInitials(testimonial.customer_name)}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold">{testimonial.customer_name}</div>
                      <div className="text-gray-300 text-sm">Customer • {testimonial.customer_location}</div>
                    </div>
                    <div className="ml-3 px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30">
                      {getServiceCategory(testimonial.review_text)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compact Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-green-400 w-6' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
