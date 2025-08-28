// src/pages/user/UserExplore.tsx - Themed Version
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
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-saffron-200 border-t-saffron-600 rounded-full animate-spin mb-6"></div>
          <p className="text-gray-600 font-semibold text-lg">Cargando pastelerías...</p>
          <p className="text-gray-500 text-sm mt-2">Descubriendo los mejores sabores para ti</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-coral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main">
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
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pastelerías o productos..."
              className="input-base w-full pl-12 pr-4 py-4 text-lg shadow-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-saffron-600" />
            <span className="text-sm font-semibold text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'open', label: 'Abierto ahora' },
              { key: 'rating', label: 'Mejor calificados' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedFilter === filter.key
                    ? 'bg-gradient-saffron text-orange-900 shadow-saffron'
                    : 'bg-white/90 text-gray-700 border-2 border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 shadow-md'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Area filter info */}
          <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-gray-200 ml-auto">
            <MapPin className="h-4 w-4 mr-2 text-saffron-600" />
            <span className="text-sm font-semibold text-gray-700">
              {filteredBusinesses.length} negocio{filteredBusinesses.length !== 1 ? 's' : ''} encontrado{filteredBusinesses.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Business Cards */}
        <div className="space-y-8">
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="text-gray-600">
                {searchTerm ? (
                  <>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">No se encontraron resultados</h3>
                    <p className="text-lg">Intenta con diferentes términos de búsqueda</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">No hay pastelerías disponibles</h3>
                    <p className="text-lg">Vuelve pronto para ver nuevos negocios</p>
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