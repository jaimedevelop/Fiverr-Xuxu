import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { getButtonClass } from '../../../utils/themeHelper';

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
    <div className="card-base shadow-brand-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
          <input
            type="text"
            placeholder="Buscar postres por nombre, etiquetas o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base pl-12 pr-4"
          />
        </div>
        
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-base min-w-48"
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
          className={`${getButtonClass('outline')} flex items-center gap-2 hover:border-purple-300 hover:text-purple-600`}
        >
          <Filter size={18} />
          Ordenar
        </button>
        
        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl flex items-center gap-2 transition-all duration-200 font-medium"
          >
            <X size={18} />
            Limpiar
          </button>
        )}
      </div>
      
      {/* Advanced Filters - Sort Options */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ordenar Por
              </label>
              <select 
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                className="input-base"
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
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Disponibilidad
              </label>
              <select 
                className="input-base opacity-60"
                disabled
              >
                <option>Todos los Artículos</option>
                <option>Disponible</option>
                <option>No Disponible</option>
              </select>
              <p className="text-xs text-purple-500 mt-2 font-medium">Próximamente</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-600">Filtros activos:</span>
            {searchTerm && (
              <span className="badge-base bg-sky-100 text-sky-700 font-medium">
                Búsqueda: "{searchTerm}"
              </span>
            )}
            {selectedCategory && (
              <span className="badge-base bg-emerald-100 text-emerald-700 font-medium">
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