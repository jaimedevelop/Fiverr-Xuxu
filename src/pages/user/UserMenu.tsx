// src/pages/user/UserMenu.tsx - Transformed to business-specific
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ID de negocio no encontrado
          </h2>
          <p className="text-gray-600 mb-4">
            No se pudo identificar el negocio solicitado.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
      <div className="min-h-screen bg-gray-50">
        {/* Show basic header while loading */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <span className="text-sm font-medium">← Volver a Explorar</span>
            </button>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <span className="text-sm font-medium">← Volver a Explorar</span>
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState message={error} />
          <div className="text-center mt-4">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Volver a Explorar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where business was not found
  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Negocio no encontrado
          </h2>
          <p className="text-gray-600 mb-4">
            El negocio solicitado no existe o no está disponible.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a Explorar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Business Header */}
      <BusinessHeader
        business={business}
        onBack={handleBack}
        // onToggleFavorite={() => {}} // Will be implemented when favorites are restored
        // isFavorite={false} // Will be implemented when favorites are restored
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Search Bar */}
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch} 
            initialValue={filters.search}
            placeholder={`Buscar en ${business.storeName}...`}
          />
        </div>

        {/* Filters and Sorting */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
          <div className="w-full sm:w-2/3">
            <CategoryFilter
              categories={categories}
              selectedCategory={filters.category}
              onSelectCategory={handleCategorySelect}
            />
          </div>
          <div className="w-full sm:w-1/3">
            <SortOptions
              currentSort={sort}
              onSortChange={handleSortChange}
            />
          </div>
        </div>

        {/* Menu Content */}
        <div className="mb-6">
          {pastries.length === 0 ? (
            <EmptyState 
              hasSearch={!!filters.search || !!filters.category}
              businessName={business.storeName}
            />
          ) : (
            <>
              {/* Results count */}
              <div className="mb-4 text-sm text-gray-600">
                {pastries.length} producto{pastries.length !== 1 ? 's' : ''} 
                {filters.search || filters.category ? ' encontrado' + (pastries.length !== 1 ? 's' : '') : ''}
                {filters.search && ` para "${filters.search}"`}
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