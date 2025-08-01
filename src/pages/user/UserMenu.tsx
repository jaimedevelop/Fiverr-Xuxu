import React, { useState } from 'react';
import { usePastries } from '../../hooks/usePastries';
import MenuHeader from '../../components/user/userMenu/MenuHeader';
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
  const {
    pastries,
    categories,
    loading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
  } = usePastries();

  const [selectedPastry, setSelectedPastry] = useState<Pastry | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <MenuHeader />

        {/* Search Bar */}
        <div className="mt-6">
          <SearchBar onSearch={handleSearch} initialValue={filters.search} />
        </div>

        {/* Filters and Sorting */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
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

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : pastries.length === 0 ? (
            <EmptyState hasSearch={!!filters.search || !!filters.category} />
          ) : (
            <PastryGrid
              pastries={pastries}
              onPastryClick={setSelectedPastry}
            />
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