import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProfessionalsData } from '@/hooks/useProfessionalsData';
import { filterProfessionals, sortProfessionals } from '@/utils/professionalFiltering';
import { useLocationTracking } from '@/hooks/location/useLocationTracking';
import { Professional } from '@/types/professional';

export const useProfessionalsPage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'experience'>('rating');
  const [selectedType, setSelectedType] = useState<'handyman' | 'contractor' | 'all'>('all');
  
  const { currentLocation } = useLocationTracking();
  const { professionals, loading, fetchProfessionals } = useProfessionalsData();

  // Convert location format
  const userLocation = currentLocation ? {
    lat: currentLocation.latitude,
    lng: currentLocation.longitude
  } : null;

  // Initialize search term from URL params
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);

  // Fetch professionals when location or filters change
  useEffect(() => {
    console.log('Fetching professionals with location:', userLocation);
    fetchProfessionals(selectedType, userLocation);
  }, [selectedType, userLocation?.lat, userLocation?.lng, fetchProfessionals]);

  // Listen for refresh events
  useEffect(() => {
    const handleRefetch = () => {
      fetchProfessionals(selectedType, userLocation);
    };

    window.addEventListener('refetch-professionals', handleRefetch);
    return () => window.removeEventListener('refetch-professionals', handleRefetch);
  }, [selectedType, userLocation, fetchProfessionals]);

  // Filter and sort professionals
  const filteredProfessionals = sortProfessionals(
    filterProfessionals(professionals, searchTerm, selectedType),
    sortBy
  );

  console.log('useProfessionalsPage - userLocation:', userLocation);
  console.log('useProfessionalsPage - professionals count:', professionals.length);
  console.log('useProfessionalsPage - filtered count:', filteredProfessionals.length);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    selectedType,
    setSelectedType,
    loading,
    filteredProfessionals,
    userLocation
  };
};