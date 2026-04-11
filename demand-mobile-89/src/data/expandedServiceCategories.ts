import { 
  Home, Wrench, Paintbrush, Droplets, Zap, Sofa, Hammer, TreePine, 
  Car, ShieldCheck, Bath, Snowflake, Wind, Cpu, Camera, 
  UtensilsCrossed, Shirt, Package, Scissors, Flower
} from 'lucide-react';

export interface ServiceSubcategory {
  id: string;
  name: string;
  description: string;
  skillKeywords: string[];
}

export interface ExpandedServiceCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  subcategories: ServiceSubcategory[];
  skillKeywords: string[];
}

export const expandedServiceCategories: ExpandedServiceCategory[] = [
  {
    id: 'cleaning',
    name: 'Cleaning Services',
    icon: Home,
    color: 'bg-green-100 text-green-600',
    description: 'Professional cleaning and maintenance services',
    skillKeywords: ['cleaning', 'housekeeping', 'janitorial', 'sanitizing'],
    subcategories: [
      {
        id: 'deep-clean',
        name: 'Deep Cleaning',
        description: 'Comprehensive deep cleaning including all areas',
        skillKeywords: ['deep cleaning', 'thorough cleaning', 'detailed cleaning']
      },
      {
        id: 'regular-clean',
        name: 'Regular House Cleaning',
        description: 'Standard weekly/bi-weekly cleaning',
        skillKeywords: ['house cleaning', 'regular cleaning', 'maintenance cleaning']
      },
      {
        id: 'move-clean',
        name: 'Move-in/Move-out Cleaning',
        description: 'Thorough cleaning for moving',
        skillKeywords: ['move out cleaning', 'move in cleaning', 'transition cleaning']
      },
      {
        id: 'office-clean',
        name: 'Office Cleaning',
        description: 'Commercial office space cleaning',
        skillKeywords: ['office cleaning', 'commercial cleaning', 'business cleaning']
      },
      {
        id: 'window-clean',
        name: 'Window Cleaning',
        description: 'Interior and exterior window cleaning',
        skillKeywords: ['window cleaning', 'glass cleaning', 'window washing']
      },
      {
        id: 'carpet-clean',
        name: 'Carpet & Upholstery Cleaning',
        description: 'Professional carpet and furniture cleaning',
        skillKeywords: ['carpet cleaning', 'upholstery cleaning', 'steam cleaning']
      }
    ]
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    icon: Droplets,
    color: 'bg-blue-100 text-blue-600',
    description: 'Professional plumbing installation and repair',
    skillKeywords: ['plumbing', 'plumber', 'pipes', 'water'],
    subcategories: [
      {
        id: 'leak-repair',
        name: 'Leak Repair',
        description: 'Fix leaky faucets, pipes, and fixtures',
        skillKeywords: ['leak repair', 'pipe repair', 'faucet repair', 'water leak']
      },
      {
        id: 'drain-clean',
        name: 'Drain Cleaning',
        description: 'Clear clogged drains and pipes',
        skillKeywords: ['drain cleaning', 'unclog drain', 'pipe cleaning', 'sewer cleaning']
      },
      {
        id: 'toilet-repair',
        name: 'Toilet Repair/Installation',
        description: 'Toilet repairs and new installations',
        skillKeywords: ['toilet repair', 'toilet installation', 'toilet replacement']
      },
      {
        id: 'faucet-install',
        name: 'Faucet Installation',
        description: 'New faucet installation and replacement',
        skillKeywords: ['faucet installation', 'faucet replacement', 'tap installation']
      },
      {
        id: 'water-heater',
        name: 'Water Heater Service',
        description: 'Water heater maintenance and repairs',
        skillKeywords: ['water heater', 'hot water heater', 'tankless water heater']
      },
      {
        id: 'pipe-install',
        name: 'Pipe Installation',
        description: 'New pipe installation and replacement',
        skillKeywords: ['pipe installation', 'plumbing installation', 'new pipes']
      }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Licensed electrical work and installations',
    skillKeywords: ['electrical', 'electrician', 'wiring', 'electric'],
    subcategories: [
      {
        id: 'outlet-install',
        name: 'Outlet Installation',
        description: 'New electrical outlets and GFCI installation',
        skillKeywords: ['outlet installation', 'electrical outlet', 'GFCI outlet']
      },
      {
        id: 'light-fixture',
        name: 'Light Fixture Installation',
        description: 'Ceiling lights, chandeliers, and fans',
        skillKeywords: ['light installation', 'ceiling light', 'chandelier', 'light fixture']
      },
      {
        id: 'switch-install',
        name: 'Switch Installation',
        description: 'Light switches and dimmers',
        skillKeywords: ['switch installation', 'light switch', 'dimmer switch']
      },
      {
        id: 'ceiling-fan',
        name: 'Ceiling Fan Installation',
        description: 'Ceiling fan installation and repair',
        skillKeywords: ['ceiling fan', 'fan installation', 'fan repair']
      },
      {
        id: 'electrical-repair',
        name: 'Electrical Repairs',
        description: 'Troubleshooting and fixing electrical issues',
        skillKeywords: ['electrical repair', 'electrical troubleshooting', 'wiring repair']
      },
      {
        id: 'panel-upgrade',
        name: 'Panel Upgrades',
        description: 'Electrical panel and breaker upgrades',
        skillKeywords: ['electrical panel', 'breaker panel', 'panel upgrade']
      }
    ]
  },
  {
    id: 'handyman',
    name: 'General Handyman',
    icon: Wrench,
    color: 'bg-orange-100 text-orange-600',
    description: 'General repairs and maintenance tasks',
    skillKeywords: ['handyman', 'general repair', 'maintenance', 'fix'],
    subcategories: [
      {
        id: 'minor-repairs',
        name: 'Minor Repairs',
        description: 'Small fixes and repairs around the home',
        skillKeywords: ['minor repairs', 'small repairs', 'quick fixes', 'home repairs']
      },
      {
        id: 'fixture-install',
        name: 'Fixture Installation',
        description: 'Installing lights, fans, shelves, etc.',
        skillKeywords: ['fixture installation', 'mounting', 'installation']
      },
      {
        id: 'door-window',
        name: 'Door & Window Services',
        description: 'Repairs, adjustments, and installations',
        skillKeywords: ['door repair', 'window repair', 'door installation', 'window installation']
      },
      {
        id: 'drywall-patch',
        name: 'Drywall Patching',
        description: 'Hole repairs and wall patching',
        skillKeywords: ['drywall repair', 'wall repair', 'hole patching', 'drywall patching']
      },
      {
        id: 'caulking',
        name: 'Caulking & Weatherproofing',
        description: 'Seal gaps and improve insulation',
        skillKeywords: ['caulking', 'weatherproofing', 'sealing', 'insulation']
      },
      {
        id: 'shelving',
        name: 'Shelving & Storage',
        description: 'Custom shelving and storage solutions',
        skillKeywords: ['shelving', 'storage installation', 'closet organization']
      }
    ]
  },
  {
    id: 'painting',
    name: 'Painting Services',
    icon: Paintbrush,
    color: 'bg-purple-100 text-purple-600',
    description: 'Interior and exterior painting services',
    skillKeywords: ['painting', 'painter', 'paint', 'wall painting'],
    subcategories: [
      {
        id: 'interior-paint',
        name: 'Interior Painting',
        description: 'Professional interior painting service',
        skillKeywords: ['interior painting', 'room painting', 'wall painting']
      },
      {
        id: 'exterior-paint',
        name: 'Exterior Painting',
        description: 'Exterior house painting and touch-ups',
        skillKeywords: ['exterior painting', 'house painting', 'outdoor painting']
      },
      {
        id: 'accent-wall',
        name: 'Accent Wall',
        description: 'Feature wall painting and design',
        skillKeywords: ['accent wall', 'feature wall', 'decorative painting']
      },
      {
        id: 'cabinet-paint',
        name: 'Cabinet Painting',
        description: 'Kitchen and bathroom cabinet refinishing',
        skillKeywords: ['cabinet painting', 'cabinet refinishing', 'kitchen cabinets']
      },
      {
        id: 'deck-staining',
        name: 'Deck Staining',
        description: 'Deck and fence staining services',
        skillKeywords: ['deck staining', 'fence staining', 'wood staining']
      },
      {
        id: 'pressure-washing',
        name: 'Pressure Washing',
        description: 'Exterior cleaning and preparation',
        skillKeywords: ['pressure washing', 'power washing', 'exterior cleaning']
      }
    ]
  },
  {
    id: 'assembly',
    name: 'Furniture Assembly',
    icon: Sofa,
    color: 'bg-indigo-100 text-indigo-600',
    description: 'Professional furniture assembly services',
    skillKeywords: ['furniture assembly', 'assembly', 'ikea assembly'],
    subcategories: [
      {
        id: 'ikea-assembly',
        name: 'IKEA Furniture Assembly',
        description: 'Professional IKEA furniture assembly',
        skillKeywords: ['ikea assembly', 'ikea furniture', 'swedish furniture']
      },
      {
        id: 'office-furniture',
        name: 'Office Furniture Assembly',
        description: 'Desks, chairs, and office equipment',
        skillKeywords: ['office furniture', 'desk assembly', 'chair assembly']
      },
      {
        id: 'bedroom-set',
        name: 'Bedroom Set Assembly',
        description: 'Beds, dressers, and nightstands',
        skillKeywords: ['bedroom furniture', 'bed assembly', 'dresser assembly']
      },
      {
        id: 'outdoor-furniture',
        name: 'Outdoor Furniture Assembly',
        description: 'Patio and garden furniture assembly',
        skillKeywords: ['outdoor furniture', 'patio furniture', 'garden furniture']
      },
      {
        id: 'tv-mount',
        name: 'TV Mounting',
        description: 'Professional TV wall mounting service',
        skillKeywords: ['tv mounting', 'wall mount', 'tv installation']
      },
      {
        id: 'exercise-equipment',
        name: 'Exercise Equipment Assembly',
        description: 'Treadmills, bikes, and home gym equipment',
        skillKeywords: ['exercise equipment', 'gym equipment', 'fitness equipment']
      }
    ]
  },
  {
    id: 'hvac',
    name: 'HVAC Services',
    icon: Snowflake,
    color: 'bg-cyan-100 text-cyan-600',
    description: 'Heating, ventilation, and air conditioning',
    skillKeywords: ['hvac', 'heating', 'cooling', 'air conditioning'],
    subcategories: [
      {
        id: 'ac-repair',
        name: 'AC Repair & Maintenance',
        description: 'Air conditioning repair and tune-ups',
        skillKeywords: ['ac repair', 'air conditioning', 'cooling repair']
      },
      {
        id: 'heater-repair',
        name: 'Heater Repair',
        description: 'Heating system repair and maintenance',
        skillKeywords: ['heater repair', 'heating repair', 'furnace repair']
      },
      {
        id: 'duct-cleaning',
        name: 'Duct Cleaning',
        description: 'Air duct cleaning and sanitization',
        skillKeywords: ['duct cleaning', 'air duct', 'ventilation cleaning']
      },
      {
        id: 'thermostat-install',
        name: 'Thermostat Installation',
        description: 'Smart and programmable thermostat setup',
        skillKeywords: ['thermostat', 'smart thermostat', 'programmable thermostat']
      }
    ]
  },
  {
    id: 'carpentry',
    name: 'Carpentry Services',
    icon: Hammer,
    color: 'bg-amber-100 text-amber-600',
    description: 'Custom woodwork and carpentry projects',
    skillKeywords: ['carpentry', 'carpenter', 'woodwork', 'custom wood'],
    subcategories: [
      {
        id: 'custom-shelving',
        name: 'Custom Shelving',
        description: 'Built-in and custom shelving solutions',
        skillKeywords: ['custom shelving', 'built-in shelves', 'wood shelving']
      },
      {
        id: 'cabinet-install',
        name: 'Cabinet Installation',
        description: 'Kitchen and bathroom cabinet installation',
        skillKeywords: ['cabinet installation', 'kitchen cabinets', 'custom cabinets']
      },
      {
        id: 'trim-work',
        name: 'Trim & Molding',
        description: 'Crown molding, baseboards, and trim work',
        skillKeywords: ['trim work', 'molding', 'crown molding', 'baseboards']
      },
      {
        id: 'deck-building',
        name: 'Deck Building',
        description: 'Custom deck construction and repair',
        skillKeywords: ['deck building', 'deck construction', 'deck repair']
      }
    ]
  },
  {
    id: 'landscaping',
    name: 'Landscaping & Yard Work',
    icon: TreePine,
    color: 'bg-emerald-100 text-emerald-600',
    description: 'Garden and outdoor maintenance services',
    skillKeywords: ['landscaping', 'gardening', 'yard work', 'lawn care'],
    subcategories: [
      {
        id: 'lawn-mowing',
        name: 'Lawn Mowing',
        description: 'Regular lawn cutting and edging',
        skillKeywords: ['lawn mowing', 'grass cutting', 'lawn care']
      },
      {
        id: 'tree-trimming',
        name: 'Tree Trimming',
        description: 'Tree pruning and maintenance',
        skillKeywords: ['tree trimming', 'tree pruning', 'tree care']
      },
      {
        id: 'garden-design',
        name: 'Garden Design',
        description: 'Landscape design and installation',
        skillKeywords: ['garden design', 'landscape design', 'garden planning']
      },
      {
        id: 'fence-install',
        name: 'Fence Installation',
        description: 'Residential fence installation and repair',
        skillKeywords: ['fence installation', 'fence repair', 'fencing']
      }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive Services',
    icon: Car,
    color: 'bg-slate-100 text-slate-600',
    description: 'Vehicle maintenance and repair services',
    skillKeywords: ['automotive', 'car repair', 'vehicle maintenance'],
    subcategories: [
      {
        id: 'oil-change',
        name: 'Oil Change',
        description: 'Regular oil change and filter replacement',
        skillKeywords: ['oil change', 'vehicle maintenance', 'car service']
      },
      {
        id: 'tire-service',
        name: 'Tire Services',
        description: 'Tire installation, rotation, and repair',
        skillKeywords: ['tire service', 'tire installation', 'tire repair']
      },
      {
        id: 'car-wash',
        name: 'Car Detailing',
        description: 'Professional car washing and detailing',
        skillKeywords: ['car detailing', 'car wash', 'vehicle cleaning']
      }
    ]
  },
  {
    id: 'security',
    name: 'Security & Safety',
    icon: ShieldCheck,
    color: 'bg-red-100 text-red-600',
    description: 'Home security and safety installations',
    skillKeywords: ['security', 'safety', 'alarm system', 'surveillance'],
    subcategories: [
      {
        id: 'security-camera',
        name: 'Security Camera Installation',
        description: 'Home security camera setup and configuration',
        skillKeywords: ['security camera', 'surveillance camera', 'cctv installation']
      },
      {
        id: 'alarm-system',
        name: 'Alarm System Installation',
        description: 'Home alarm and monitoring system setup',
        skillKeywords: ['alarm system', 'security system', 'home security']
      },
      {
        id: 'smart-lock',
        name: 'Smart Lock Installation',
        description: 'Smart door lock installation and setup',
        skillKeywords: ['smart lock', 'door lock', 'keyless entry']
      }
    ]
  },
  {
    id: 'technology',
    name: 'Technology Services',
    icon: Cpu,
    color: 'bg-violet-100 text-violet-600',
    description: 'Technology setup and troubleshooting',
    skillKeywords: ['technology', 'tech support', 'computer', 'smart home'],
    subcategories: [
      {
        id: 'smart-home',
        name: 'Smart Home Setup',
        description: 'Smart home device installation and configuration',
        skillKeywords: ['smart home', 'home automation', 'iot setup']
      },
      {
        id: 'computer-repair',
        name: 'Computer Repair',
        description: 'Computer troubleshooting and repair',
        skillKeywords: ['computer repair', 'pc repair', 'tech support']
      },
      {
        id: 'network-setup',
        name: 'Network Setup',
        description: 'WiFi and network configuration',
        skillKeywords: ['network setup', 'wifi setup', 'internet setup']
      }
    ]
  }
];

// Helper function to get all skill keywords from categories
export const getAllSkillKeywords = (): string[] => {
  const allKeywords: string[] = [];
  
  expandedServiceCategories.forEach(category => {
    allKeywords.push(...category.skillKeywords);
    category.subcategories.forEach(subcategory => {
      allKeywords.push(...subcategory.skillKeywords);
    });
  });
  
  return [...new Set(allKeywords)]; // Remove duplicates
};

// Helper function to get category by subcategory
export const getCategoryBySubcategory = (subcategoryId: string): ExpandedServiceCategory | null => {
  return expandedServiceCategories.find(category =>
    category.subcategories.some(sub => sub.id === subcategoryId)
  ) || null;
};