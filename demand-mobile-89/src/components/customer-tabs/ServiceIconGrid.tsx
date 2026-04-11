
import { ServiceModal } from './ServiceModal';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';

export const ServiceIconGrid = () => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {expandedServiceCategories.map((category) => {
        const Icon = category.icon;
        
        return (
          <ServiceModal key={category.id} category={category}>
            <button className="p-4 rounded-xl transition-all duration-200 transform hover:scale-105 border-2 bg-white hover:shadow-md border-gray-200 group">
              <div className="flex flex-col items-center space-y-2">
                <div className={`p-3 rounded-lg transition-colors ${category.color} group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-center leading-tight text-gray-700 group-hover:text-green-600">
                  {category.name}
                </span>
              </div>
            </button>
          </ServiceModal>
        );
      })}
    </div>
  );
};
