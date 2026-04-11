import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import service images
import assemblyImage from '@/assets/assembly-service.jpg';
import mountingImage from '@/assets/mounting-service.jpg';
import movingImage from '@/assets/moving-service.jpg';
import cleaningImage from '@/assets/cleaning-service.jpg';
import paintingImage from '@/assets/painting-service.jpg';
import outdoorImage from '@/assets/outdoor-service.jpg';
import repairsImage from '@/assets/repairs-service.jpg';

const serviceCards = [
  {
    id: 'plumbing',
    title: 'Plumbing',
    image: repairsImage,
    features: [
      'Fix leaks, unclog drains, and repair pipes',
      'Professional plumbing tools and expertise',
      'Emergency plumbing services available'
    ],
    popular: true
  },
  {
    id: 'electrical',
    title: 'Electrical Work',
    image: mountingImage,
    features: [
      'Install outlets, switches, and lighting fixtures',
      'Licensed electricians with safety certifications',
      'Code-compliant electrical installations'
    ]
  },
  {
    id: 'cleaning',
    title: 'House Cleaning',
    image: cleaningImage,
    features: [
      'Deep cleaning for homes and apartments',
      'Move-in/move-out cleaning services',
      'Regular maintenance cleaning schedules'
    ]
  },
  {
    id: 'assembly',
    title: 'Furniture Assembly',
    image: assemblyImage,
    features: [
      'Assemble furniture from all major brands',
      'Tools and hardware provided',
      'Professional assembly with cleanup'
    ]
  },
  {
    id: 'painting',
    title: 'Painting',
    image: paintingImage,
    features: [
      'Interior and exterior painting projects',
      'Wall preparation and professional finish',
      'Quality paints and materials included'
    ]
  },
  {
    id: 'landscaping',
    title: 'Landscaping',
    image: outdoorImage,
    features: [
      'Lawn care and garden maintenance',
      'Landscaping design and installation',
      'Seasonal yard cleanup services'
    ]
  }
];

export const GoHandyMateServiceCards = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCards.map((service) => (
            <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={service.image} 
                  alt={`${service.title} service`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {service.popular && (
                  <Badge className="absolute top-4 left-4 bg-green-600 hover:bg-green-600 text-white">
                    Popular
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};