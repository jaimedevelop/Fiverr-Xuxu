// src/pages/user/UserMenu.tsx - Themed Version
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePastries } from '../../hooks/usePastries';
import { useBusinessProfile } from '../../hooks/useBusinessProfile';
import BusinessHeader from '../../components/user/businessMenu/BusinessHeader';
import SearchBar from '../../components/user/userMenu/SearchBar';
import CategoryFilter from '../../components/user/userMenu/CategoryFilter';
import SortOptions from '../../components/user/userMenu/SortOptions';
import PastryGrid from '../../components/user/userMenu/PastryGrid';
import LoadingState from '../../components/user/userMenu/LoadingState';
import EmptyState from '../../components/user/userMenu/EmptyState';
import ErrorState from '../../components/user/userMenu/ErrorState';
import PastryDetailModal from '../../components/user/userMenu/PastryDetailModal';
import { Pastry } from '../../types/pastry';

const UserMenu = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  
  // Fetch business-specific data
  const { business, loading: businessLoading, error: businessError } = useBusinessProfile(businessId);
  const {
    pastries,
    categories,
    loading: pastriesLoading,
    error: pastriesError,
    filters,
    setFilters,
    sort,
    setSort,
  } = usePastries({ businessId });

  const [selectedPastry, setSelectedPastry] = useState<Pastry | null>(null);

  const loading = businessLoading || pastriesLoading;
  const error = businessError || pastriesError;

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setFilters(prev => ({ ...prev, category: categoryId }));
  };

  const handleSortChange = (sortOption: string) => {
    setSort(sortOption as any);
  };

  const handleCloseModal = () => {
    setSelectedPastry(null);
  };

  const handleBack = () => {
    navigate('/explore');
  };

  // Handle missing businessId
  if (!businessId) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-center card-base p-8 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            ID de negocio no encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            No se pudo identificar el negocio solicitado.
          </p>
          <button
            onClick={handleBack}
            className="btn-primary"
          >
            Volver a Explorar
          </button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main">
        {/* Show basic header while loading */}
        <div className="card-base bg-white/95 backdrop-blur-sm shadow-lg border-b border-saffron-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-saffron-600 transition-colors duration-200 mb-6 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Volver a Explorar</span>
            </button>
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4"></div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-saffron-200 border-t-saffron-600 rounded-full animate-spin mb-6"></div>
              <p className="text-gray-600 font-semibold text-lg">Cargando menú...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <div className="card-base bg-white/95 backdrop-blur-sm shadow-lg border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-saffron-600 transition-colors duration-200 mb-6 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Volver a Explorar</span>
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center card-base p-8 max-w-md">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <ErrorState message={error} />
              <button
                onClick={handleBack}
                className="btn-primary mt-6"
              >
                Volver a Explorar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where business was not found
  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-center card-base p-8 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Negocio no encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            El negocio solicitado no existe o no está disponible.
          </p>
          <button
            onClick={handleBack}
            className="btn-primary"
          >
            Volver a Explorar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      {/* Business Header */}
      <BusinessHeader
        business={business}
        onBack={handleBack}
        // onToggleFavorite={() => {}} // Will be implemented when favorites are restored
        // isFavorite={false} // Will be implemented when favorites are restored
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Search Bar */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            initialValue={filters.search}
            placeholder={`Buscar en ${business.storeName}...`}
          />
        </div>

        {/* Filters and Sorting */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card-base p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Categorías</h3>
              <CategoryFilter
                categories={categories}
                selectedCategory={filters.category}
                onSelectCategory={handleCategorySelect}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="card-base p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Ordenar por</h3>
              <SortOptions
                currentSort={sort}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </div>

        {/* Menu Content */}
        <div className="mb-6">
          {pastries.length === 0 ? (
            <div className="card-base p-8">
              <EmptyState 
                hasSearch={!!filters.search || !!filters.category}
                businessName={business.storeName}
              />
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-6 flex items-center justify-between">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">
                    {pastries.length} producto{pastries.length !== 1 ? 's' : ''}
                    {filters.search || filters.category ? ' encontrado' + (pastries.length !== 1 ? 's' : '') : ''}
                    {filters.search && ` para "${filters.search}"`}
                  </span>
                </div>
                
                {(filters.search || filters.category) && (
                  <button
                    onClick={() => {
                      setFilters({ search: '', category: null });
                    }}
                    className="text-sm text-saffron-600 hover:text-saffron-800 font-medium transition-colors duration-200"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
              
              <PastryGrid
                pastries={pastries}
                onPastryClick={setSelectedPastry}
              />
            </>
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

export default UserMenu;