import React, { useState } from 'react';
import { usePastries } from '../../hooks/usePastries';
import MenuList from '../../components/admin/menuManagement/MenuList';
import MenuItemForm from '../../components/admin/menuManagement/MenuItemForm';
import CategoryManager from '../../components/admin/menuManagement/CategoryManager';
import MenuFilters from '../../components/admin/menuManagement/MenuFilters';
import { Plus, Settings, Grid, List, AlertCircle } from 'lucide-react';
import { getButtonClass, colors } from '../../utils/themeHelper';

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
      <div className="min-h-screen bg-gradient-main p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="card-base p-8 border border-red-200 bg-red-50">
            <div className="flex items-center gap-4">
              <AlertCircle size={32} className="text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Cargando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="card-base p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-3">
                Gestión de Menú
              </h1>
              <p className="text-lg text-gray-600">
                Administra tus listados de postres, categorías e inventario
              </p>
            </div>
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddNew}
                  className={`${getButtonClass('admin')} flex items-center gap-3`}
                >
                  <Plus size={20} />
                  Añadir Nuevo Postre
                </button>
                
                <button
                  onClick={() => setIsCategoryManagerOpen(true)}
                  className={`${getButtonClass('accent')} flex items-center gap-3`}
                >
                  <Settings size={20} />
                  Gestionar Categorías
                </button>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1.5 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Vista en cuadrícula"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Vista en lista"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Filters Section */}
          <div className="card-base p-6">
            <MenuFilters
              categories={categories}
              filters={filters}
              sort={sort}
              onFiltersChange={setFilters}
              onSortChange={setSort}
            />
          </div>
          
          {/* Statistics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-interactive p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {allPastries.length}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Total de Postres
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center shadow-purple">
                  <Grid className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="card-interactive p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    {allPastries.filter(p => p.available).length}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Disponibles
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-mint rounded-lg flex items-center justify-center shadow-mint">
                  <div className="w-3 h-3 bg-emerald-800 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="card-interactive p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {allPastries.filter(p => !p.available).length}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    No Disponibles
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="card-interactive p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-saffron-600 mb-1">
                    {categories.length}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Categorías
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-saffron rounded-lg flex items-center justify-center shadow-saffron">
                  <Settings className="w-6 h-6 text-orange-800" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Results Info */}
          {allPastries.length !== pastries.length && (
            <div className="card-base p-4 border border-purple-200 bg-purple-50">
              <div className="text-sm text-purple-800">
                📊 Mostrando <span className="font-semibold">{pastries.length}</span> de{' '}
                <span className="font-semibold">{allPastries.length}</span> postres
                {(filters.search || filters.category) && (
                  <span className="ml-2 text-purple-700">
                    (filtrado{filters.search && ` por "${filters.search}"`}
                    {filters.category && ` en categoría seleccionada`})
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Menu List Section */}
          <div className="card-base p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Lista de Postres
              </h2>
              <p className="text-gray-600">
                {pastries.length === 0 
                  ? 'No hay postres que coincidan con los filtros aplicados' 
                  : `${pastries.length} postres encontrados`
                }
              </p>
            </div>
            
            <MenuList
              pastries={pastries}
              categories={categories}
              viewMode={viewMode}
              onEdit={handleEdit}
            />
          </div>
          
        </div>
      </div>
      
      {/* Forms - Outside the main container for proper overlay */}
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