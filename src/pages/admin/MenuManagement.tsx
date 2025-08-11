import React, { useState } from 'react';
import { usePastries } from '../../hooks/usePastries';
import MenuList from '../../components/admin/menuManagement/MenuList';
import MenuItemForm from '../../components/admin/menuManagement/MenuItemForm';
import CategoryManager from '../../components/admin/menuManagement/CategoryManager';
import MenuFilters from '../../components/admin/menuManagement/MenuFilters';
import { Plus, Settings, Grid, List, AlertCircle } from 'lucide-react';

const MenuManagement = () => {
  const { 
    pastries,           // Filtered and sorted pastries
    allPastries,        // Raw pastries for statistics
    categories, 
    loading, 
    error,
    filters,
    setFilters,
    sort,
    setSort
  } = usePastries();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-red-600" />
            <div>
              <h2 className="text-lg font-semibold text-red-800">Error</h2>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Menú</h1>
        <p className="text-gray-600">Administra tus listados de postres, categorías e inventario</p>
      </div>
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Añadir Nuevo Postre
          </button>
          
          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Settings size={20} />
            Gestionar Categorías
          </button>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <MenuFilters
        categories={categories}
        filters={filters}
        sort={sort}
        onFiltersChange={setFilters}
        onSortChange={setSort}
      />
      
      {/* Statistics - Use allPastries for accurate stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-2xl font-bold text-blue-600">{allPastries.length}</div>
          <div className="text-sm text-gray-600">Total de Postres</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-2xl font-bold text-green-600">
            {allPastries.filter(p => p.available).length}
          </div>
          <div className="text-sm text-gray-600">Disponibles</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-2xl font-bold text-red-600">
            {allPastries.filter(p => !p.available).length}
          </div>
          <div className="text-sm text-gray-600">No Disponibles</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-2xl font-bold text-orange-600">{categories.length}</div>
          <div className="text-sm text-gray-600">Categorías</div>
        </div>
      </div>
      
      {/* Results Info */}
      {allPastries.length !== pastries.length && (
        <div className="mb-4 text-sm text-gray-600">
          Mostrando {pastries.length} de {allPastries.length} postres
          {(filters.search || filters.category) && (
            <span className="ml-2 text-blue-600">
              (filtrado{filters.search && ` por "${filters.search}"`}
              {filters.category && ` en categoría seleccionada`})
            </span>
          )}
        </div>
      )}
      
      {/* Menu List - Use filtered pastries */}
      <MenuList
        pastries={pastries}
        categories={categories}
        viewMode={viewMode}
        onEdit={handleEdit}
      />
      
      {/* Forms */}
      {isFormOpen && (
        <MenuItemForm
          item={editingItem}
          categories={categories}
          onClose={handleFormClose}
        />
      )}
      {isCategoryManagerOpen && (
        <CategoryManager
          categories={categories}
          onClose={() => setIsCategoryManagerOpen(false)}
        />
      )}
    </div>
  );
};

export default MenuManagement;