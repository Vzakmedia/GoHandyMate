
import { Button } from '@/components/ui/button';
import { Home, Plus } from 'lucide-react';
import { UnitCard } from './UnitCard';

interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  unit_name?: string;
  property_address: string;
  tenant_name?: string;
  tenant_phone?: string;
  tenant_email?: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  notes?: string;
  tags?: string[];
  created_at: string;
}

interface UnitsGridProps {
  filteredUnits: Unit[];
  searchTerm: string;
  statusFilter: string;
  onPostJob: (unitId: string) => void;
  onAddUnit: () => void;
}

export const UnitsGrid = ({ 
  filteredUnits, 
  searchTerm, 
  statusFilter, 
  onPostJob, 
  onAddUnit 
}: UnitsGridProps) => {
  if (filteredUnits.length === 0) {
    return (
      <div className="text-center py-12">
        <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No units found</h3>
        <p className="text-gray-500 mb-4">
          {searchTerm || statusFilter !== 'all' 
            ? 'Try adjusting your search or filters' 
            : 'Start by adding your first unit'
          }
        </p>
        {!searchTerm && statusFilter === 'all' && (
          <Button onClick={onAddUnit} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Unit
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredUnits.map((unit) => (
        <UnitCard key={unit.id} unit={unit} onPostJob={onPostJob} />
      ))}
    </div>
  );
};
