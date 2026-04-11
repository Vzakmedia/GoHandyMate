
import { useState, useEffect } from 'react';

interface Unit {
  id: string;
  unit_number: string;
  unit_name?: string;
  property_address: string;
  tenant_name?: string;
  status: 'vacant' | 'occupied' | 'maintenance';
}

export const useUnitsFilters = (units: Unit[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);

  useEffect(() => {
    let filtered = units;

    if (searchTerm) {
      filtered = filtered.filter(unit => 
        unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.unit_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.property_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(unit => unit.status === statusFilter);
    }

    setFilteredUnits(filtered);
  }, [units, searchTerm, statusFilter]);

  return {
    searchTerm,
    statusFilter,
    filteredUnits,
    setSearchTerm,
    setStatusFilter
  };
};
