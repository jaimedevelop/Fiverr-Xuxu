import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

const MenuFilters = ({ categories, filters, sort, onFiltersChange, onSortChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update filters when local state changes
  useEffect(() => {
    const newFilters = {
      search: searchTerm,
      category: selectedCategory || null,
    };
    
    // Only call onFiltersChange if filters actually changed
    const filtersChanged = 
      newFilters.search !== filters.search || 
      newFilters.category !== filters.category;
      
    if (filtersChanged) {
      console.log('🔍 MenuFilters: Filters changed', newFilters);
      onFiltersChange(newFilters);
    }
  }, [searchTerm, selectedCategory, filters.search, filters.category, onFiltersChange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setShowAdvanced(false);
  };

  const hasActiveFilters = searchTerm || selectedCategory;

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar postres por nombre, etiquetas o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas las Categorías</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <Filter size={18} />
          Ordenar
        </button>
        
        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
          >
            <X size={18} />
            Limpiar
          </button>
        )}
      </div>
      
      {/* Advanced Filters - Sort Options */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar Por
              </label>
              <select 
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Más Recientes Primero</option>
                <option value="oldest">Más Antiguos Primero</option>
                <option value="name-asc">Nombre (A-Z)</option>
                <option value="name-desc">Nombre (Z-A)</option>
                <option value="price-low">Precio (Menor a Mayor)</option>
                <option value="price-high">Precio (Mayor a Menor)</option>
              </select>
            </div>
            
            {/* Placeholder for future filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilidad
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              >
                <option>Todos los Artículos</option>
                <option>Disponible</option>
                <option>No Disponible</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Próximamente</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Filtros activos:</span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                Búsqueda: "{searchTerm}"
              </span>
            )}
            {selectedCategory && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Categoría: {categories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuFilters;