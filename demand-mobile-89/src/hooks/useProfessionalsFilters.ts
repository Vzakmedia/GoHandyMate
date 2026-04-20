
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useProfessionalsFilters = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'experience'>('rating');
  const [selectedType, setSelectedType] = useState<'handyman' | 'all'>(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'handyman') {
      return typeParam;
    }
    return 'all';
  });

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    selectedType,
    setSelectedType
  };
};
