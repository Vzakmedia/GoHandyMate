
import { 
  Home, Wrench, Paintbrush, Droplets, Zap, Sofa
} from 'lucide-react';

export interface ServiceOption {
  id: string;
  name: string;
  basePrice: number;
  unit?: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  services: ServiceOption[];
  propertyOptions?: string[];
  additionalOptions?: {
    rooms?: boolean;
    floors?: boolean;
    frequency?: boolean;
    urgency?: boolean;
  };
}

export const handymanCategories: ServiceCategory[] = [
  {
    id: 'cleaning',
    name: 'Cleaning Services',
    icon: Home,
    color: 'bg-green-100 text-green-600',
    services: [
      { id: 'deep-clean', name: 'Deep Cleaning', basePrice: 150, unit: 'per session', description: 'Comprehensive deep cleaning including all areas' },
      { id: 'regular-clean', name: 'Regular Cleaning', basePrice: 80, unit: 'per session', description: 'Standard weekly/bi-weekly cleaning' },
      { id: 'move-clean', name: 'Move-in/Move-out Cleaning', basePrice: 200, unit: 'per session', description: 'Thorough cleaning for moving' },
      { id: 'post-construction', name: 'Post-Construction Cleanup', basePrice: 300, unit: 'per session', description: 'Cleanup after renovation work' },
      { id: 'carpet-clean', name: 'Carpet & Upholstery Cleaning', basePrice: 120, unit: 'per room', description: 'Professional carpet and furniture cleaning' }
    ],
    propertyOptions: ['Apartment', 'Single Family Home', 'Townhouse', 'Condo', 'Business Space'],
    additionalOptions: { rooms: true, floors: true, frequency: true, urgency: true }
  },
  {
    id: 'handyman',
    name: 'General Handyman',
    icon: Wrench,
    color: 'bg-blue-100 text-blue-600',
    services: [
      { id: 'minor-repairs', name: 'Minor Repairs', basePrice: 75, unit: 'per hour', description: 'Small fixes and repairs around the home' },
      { id: 'fixture-install', name: 'Fixture Installation', basePrice: 100, unit: 'per fixture', description: 'Installing lights, fans, shelves, etc.' },
      { id: 'door-window', name: 'Door & Window Services', basePrice: 120, unit: 'per item', description: 'Repairs, adjustments, and installations' },
      { id: 'drywall-patch', name: 'Drywall Patching', basePrice: 80, unit: 'per patch', description: 'Hole repairs and wall patching' },
      { id: 'caulking', name: 'Caulking & Weatherproofing', basePrice: 60, unit: 'per room', description: 'Seal gaps and improve insulation' }
    ],
    propertyOptions: ['Apartment', 'Single Family Home', 'Townhouse', 'Condo', 'Business Space'],
    additionalOptions: { urgency: true }
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    icon: Droplets,
    color: 'bg-cyan-100 text-cyan-600',
    services: [
      { id: 'leak-repair', name: 'Leak Repair', basePrice: 150, unit: 'per repair', description: 'Fix leaky faucets, pipes, and fixtures' },
      { id: 'drain-clean', name: 'Drain Cleaning', basePrice: 100, unit: 'per drain', description: 'Clear clogged drains and pipes' },
      { id: 'toilet-repair', name: 'Toilet Repair/Installation', basePrice: 120, unit: 'per toilet', description: 'Toilet repairs and new installations' },
      { id: 'faucet-install', name: 'Faucet Installation', basePrice: 90, unit: 'per faucet', description: 'New faucet installation and replacement' },
      { id: 'water-heater', name: 'Water Heater Service', basePrice: 200, unit: 'per service', description: 'Water heater maintenance and repairs' }
    ],
    propertyOptions: ['Apartment', 'Single Family Home', 'Townhouse', 'Condo', 'Business Space'],
    additionalOptions: { urgency: true }
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-600',
    services: [
      { id: 'outlet-install', name: 'Outlet Installation', basePrice: 80, unit: 'per outlet', description: 'New electrical outlets and GFCI installation' },
      { id: 'light-fixture', name: 'Light Fixture Installation', basePrice: 100, unit: 'per fixture', description: 'Ceiling lights, chandeliers, and fans' },
      { id: 'switch-install', name: 'Switch Installation', basePrice: 60, unit: 'per switch', description: 'Light switches and dimmers' },
      { id: 'electrical-repair', name: 'Electrical Repairs', basePrice: 120, unit: 'per hour', description: 'Troubleshooting and fixing electrical issues' },
      { id: 'panel-upgrade', name: 'Panel Upgrades', basePrice: 800, unit: 'per panel', description: 'Electrical panel and breaker upgrades' }
    ],
    propertyOptions: ['Apartment', 'Single Family Home', 'Townhouse', 'Condo', 'Business Space'],
    additionalOptions: { urgency: true }
  },
  {
    id: 'painting',
    name: 'Painting Services',
    icon: Paintbrush,
    color: 'bg-purple-100 text-purple-600',
    services: [
      { id: 'interior-paint', name: 'Interior Painting', basePrice: 200, unit: 'per room', description: 'Professional interior painting service' },
      { id: 'exterior-paint', name: 'Exterior Painting', basePrice: 500, unit: 'per project', description: 'Exterior house painting and touch-ups' },
      { id: 'accent-wall', name: 'Accent Wall', basePrice: 150, unit: 'per wall', description: 'Feature wall painting and design' },
      { id: 'cabinet-paint', name: 'Cabinet Painting', basePrice: 300, unit: 'per kitchen', description: 'Kitchen and bathroom cabinet refinishing' },
      { id: 'deck-staining', name: 'Deck Staining', basePrice: 400, unit: 'per deck', description: 'Deck and fence staining services' }
    ],
    propertyOptions: ['Apartment', 'Single Family Home', 'Townhouse', 'Condo', 'Business Space'],
    additionalOptions: { rooms: true, urgency: true }
  },
  {
    id: 'assembly',
    name: 'Furniture Assembly',
    icon: Sofa,
    color: 'bg-indigo-100 text-indigo-600',
    services: [
      { id: 'ikea-assembly', name: 'IKEA Furniture Assembly', basePrice: 80, unit: 'per item', description: 'Professional IKEA furniture assembly' },
      { id: 'office-furniture', name: 'Office Furniture Assembly', basePrice: 100, unit: 'per item', description: 'Desks, chairs, and office equipment' },
      { id: 'bedroom-set', name: 'Bedroom Set Assembly', basePrice: 150, unit: 'per set', description: 'Beds, dressers, and nightstands' },
      { id: 'outdoor-furniture', name: 'Outdoor Furniture Assembly', basePrice: 120, unit: 'per item', description: 'Patio and garden furniture assembly' },
      { id: 'tv-mount', name: 'TV Mounting', basePrice: 100, unit: 'per TV', description: 'Professional TV wall mounting service' }
    ],
    propertyOptions: ['Apartment', 'Single Family Home', 'Townhouse', 'Condo', 'Business Space'],
    additionalOptions: { urgency: true }
  }
];
