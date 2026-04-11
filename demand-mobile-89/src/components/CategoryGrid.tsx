
import { 
  Home, Wrench, Car, Paintbrush, Camera, Package, 
  Hammer, Sofa, ShoppingCart, Truck, Monitor, 
  Zap, Droplets, ShieldCheck, Scissors, Baby,
  UtensilsCrossed, GraduationCap, Heart, Gamepad2,
  Users, Gift, Music, TreePine, Shirt, Calculator
} from "lucide-react";

interface CategoryGridProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  limitDisplay?: boolean;
}

export const CategoryGrid = ({ selectedCategory, onCategorySelect, limitDisplay = false }: CategoryGridProps) => {
  const categories = [
    // Home Services
    { name: "Cleaning", icon: Home, color: "bg-green-100 text-green-600", bgColor: "bg-green-50" },
    { name: "Handyman", icon: Wrench, color: "bg-yellow-100 text-yellow-600", bgColor: "bg-yellow-50" },
    { name: "Plumbing", icon: Droplets, color: "bg-blue-100 text-blue-600", bgColor: "bg-blue-50" },
    { name: "Electrical", icon: Zap, color: "bg-yellow-100 text-yellow-700", bgColor: "bg-yellow-50" },
    { name: "Painting", icon: Paintbrush, color: "bg-purple-100 text-purple-600", bgColor: "bg-purple-50" },
    { name: "Carpentry", icon: Hammer, color: "bg-orange-100 text-orange-600", bgColor: "bg-orange-50" },
    
    // Moving & Delivery
    { name: "Moving", icon: Package, color: "bg-green-100 text-green-700", bgColor: "bg-green-50" },
    { name: "Delivery", icon: Car, color: "bg-blue-100 text-blue-700", bgColor: "bg-blue-50" },
    { name: "Heavy Lifting", icon: Truck, color: "bg-gray-100 text-gray-700", bgColor: "bg-gray-50" },
    { name: "Junk Removal", icon: ShoppingCart, color: "bg-red-100 text-red-600", bgColor: "bg-red-50" },
    
    // Furniture & Assembly
    { name: "Furniture Assembly", icon: Sofa, color: "bg-indigo-100 text-indigo-600", bgColor: "bg-indigo-50" },
    { name: "TV Mounting", icon: Monitor, color: "bg-slate-100 text-slate-600", bgColor: "bg-slate-50" },
    { name: "Home Security", icon: ShieldCheck, color: "bg-green-100 text-green-700", bgColor: "bg-green-50" },
    
    // Personal Services
    { name: "Photography", icon: Camera, color: "bg-pink-100 text-pink-600", bgColor: "bg-pink-50" },
    { name: "Hair & Beauty", icon: Scissors, color: "bg-purple-100 text-purple-700", bgColor: "bg-purple-50" },
    { name: "Personal Training", icon: Heart, color: "bg-red-100 text-red-700", bgColor: "bg-red-50" },
    { name: "Tutoring", icon: GraduationCap, color: "bg-blue-100 text-blue-700", bgColor: "bg-blue-50" },
    { name: "Babysitting", icon: Baby, color: "bg-pink-100 text-pink-700", bgColor: "bg-pink-50" },
    
    // Events & Entertainment
    { name: "Event Planning", icon: Users, color: "bg-yellow-100 text-yellow-700", bgColor: "bg-yellow-50" },
    { name: "DJ Services", icon: Music, color: "bg-purple-100 text-purple-700", bgColor: "bg-purple-50" },
    { name: "Gaming Setup", icon: Gamepad2, color: "bg-indigo-100 text-indigo-700", bgColor: "bg-indigo-50" },
    { name: "Gift Wrapping", icon: Gift, color: "bg-red-100 text-red-700", bgColor: "bg-red-50" },
    
    // Specialized Services
    { name: "Cooking", icon: UtensilsCrossed, color: "bg-orange-100 text-orange-700", bgColor: "bg-orange-50" },
    { name: "Yard Work", icon: TreePine, color: "bg-green-100 text-green-800", bgColor: "bg-green-50" },
    { name: "Laundry", icon: Shirt, color: "bg-blue-100 text-blue-800", bgColor: "bg-blue-50" },
    { name: "Bookkeeping", icon: Calculator, color: "bg-gray-100 text-gray-800", bgColor: "bg-gray-50" },
  ];

  const displayedCategories = limitDisplay ? categories.slice(0, 6) : categories;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {displayedCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.name;
          
          return (
            <button
              key={category.name}
              onClick={() => onCategorySelect(isSelected ? null : category.name)}
              className={`
                p-3 sm:p-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-md
                ${isSelected 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : `${category.bgColor} hover:shadow-md border border-gray-100`
                }
              `}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className={`p-2 sm:p-3 rounded-lg ${isSelected ? 'bg-green-500' : category.color}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className={`text-xs sm:text-sm font-medium text-center leading-tight ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                  {category.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
