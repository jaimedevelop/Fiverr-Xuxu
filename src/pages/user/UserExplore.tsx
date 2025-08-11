// src/pages/user/UserExplore.tsx - Clean Production Version
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin } from 'lucide-react';
import { useBusinesses } from '../../hooks/useBusinesses';
import { usePastries } from '../../hooks/usePastries';
import BusinessCard from '../../components/user/explore/BusinessCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PastryDetailModal from '../../components/user/userMenu/PastryDetailModal';
import { Pastry } from '../../types/pastry';
import { Business } from '../../types/business';

const UserExplore = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedPastry, setSelectedPastry] = useState<Pastry | null>(null);

  // Debounce the search term to prevent excessive API calls and re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch all businesses and all pastries using debounced search term
  const { businesses, loading: businessesLoading, error: businessesError } = useBusinesses({
    search: debouncedSearchTerm
  });
  
  const { allPastries, loading: pastriesLoading } = usePastries();

  const loading = businessesLoading || pastriesLoading;
  const error = businessesError;

  // Group pastries by business
  const pastriesByBusiness = useMemo(() => {
    const grouped: Record<string, Pastry[]> = {};
    
    allPastries.forEach(pastry => {
      if (!grouped[pastry.businessId]) {
        grouped[pastry.businessId] = [];
      }
      grouped[pastry.businessId].push(pastry);
    });

    // Sort pastries within each business by creation date (newest first)
    Object.keys(grouped).forEach(businessId => {
      grouped[businessId].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    });

    return grouped;
  }, [allPastries]);

  // Filter businesses based on selected filter
  const filteredBusinesses = useMemo(() => {
    let filtered = [...businesses];

    switch (selectedFilter) {
      case 'open':
        // Filter only open businesses - would need business hours logic
        break;
      case 'rating':
        // Filter by rating - would need rating data
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    return filtered;
  }, [businesses, selectedFilter]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleViewMenu = useCallback((businessId: string) => {
    navigate(`/usuario/menu/${businessId}`);
  }, [navigate]);

  const handlePastryClick = useCallback((pastry: Pastry) => {
    setSelectedPastry(pastry);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPastry(null);
  }, []);

  const handleFilterChange = useCallback((filterKey: string) => {
    setSelectedFilter(filterKey);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Cargando negocios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Explorar Pastelerías
          </h1>
          <p className="text-gray-600">
            Descubre las mejores pastelerías de tu zona
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pastelerías o productos..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'open', label: 'Abierto ahora' },
              { key: 'rating', label: 'Mejor calificados' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Area filter info */}
          <div className="flex items-center text-sm text-gray-500 ml-auto">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{filteredBusinesses.length} negocio{filteredBusinesses.length !== 1 ? 's' : ''} encontrado{filteredBusinesses.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Business Cards */}
        <div className="space-y-6">
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm ? (
                  <>
                    <p className="text-lg font-medium mb-2">No se encontraron resultados</p>
                    <p>Intenta con diferentes términos de búsqueda</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">No hay pastelerías disponibles</p>
                    <p>Vuelve pronto para ver nuevos negocios</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            filteredBusinesses.map((business) => {
              const businessPastries = pastriesByBusiness[business.id] || [];
              
              return (
                <BusinessCard
                  key={business.id}
                  business={business}
                  featuredPastries={businessPastries}
                  onViewMenu={handleViewMenu}
                  onPastryClick={handlePastryClick}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Pastry Detail Modal */}
      <PastryDetailModal
        pastry={selectedPastry}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default UserExplore;