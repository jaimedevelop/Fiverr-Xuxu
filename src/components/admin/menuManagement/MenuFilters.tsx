import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

const MenuFilters = ({ pastries, categories, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Apply filters whenever any filter changes
  useEffect(() => {
    let filtered = [...pastries];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pastry =>
        pastry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pastry.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pastry => pastry.categoryId === selectedCategory);
    }
    
    // Availability filter
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(pastry => {
        if (availabilityFilter === 'available') return pastry.available;
        if (availabilityFilter === 'unavailable') return !pastry.available;
        if (availabilityFilter === 'low-stock') return pastry.inventory <= 5 && pastry.inventory > 0;
        if (availabilityFilter === 'out-of-stock') return pastry.inventory === 0;
        return true;
      });
    }
    
    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(pastry => {
        const price = parseFloat(pastry.price);
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }
    
    onFilter(filtered);
  }, [pastries, searchTerm, selectedCategory, availabilityFilter, priceRange.min, priceRange.max]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setAvailabilityFilter('all');
    setPriceRange({ min: '', max: '' });
    setShowAdvanced(false);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || 
                          availabilityFilter !== 'all' || priceRange.min || priceRange.max;

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar postres por nombre o descripción..."
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
          <option value="all">Todas las Categorías</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
        {/* Availability Filter */}
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos los Artículos</option>
          <option value="available">Disponible</option>
          <option value="unavailable">No Disponible</option>
          <option value="low-stock">Stock Bajo (≤5)</option>
          <option value="out-of-stock">Sin Stock</option>
        </select>
        
        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <Filter size={18} />
          Avanzado
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
      
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Precio (MXN)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="flex items-center text-gray-500">a</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar Por
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="newest">Más Recientes Primero</option>
                <option value="oldest">Más Antiguos Primero</option>
                <option value="name-asc">Nombre (A-Z)</option>
                <option value="name-desc">Nombre (Z-A)</option>
                <option value="price-low">Precio (Menor a Mayor)</option>
                <option value="price-high">Precio (Mayor a Menor)</option>
                <option value="inventory">Nivel de Inventario</option>
              </select>
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
            {selectedCategory !== 'all' && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Categoría: {categories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
            {availabilityFilter !== 'all' && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                Estado: {availabilityFilter === 'low-stock' ? 'Stock Bajo' : 
                         availabilityFilter === 'out-of-stock' ? 'Sin Stock' : 
                         availabilityFilter === 'available' ? 'Disponible' : 'No Disponible'}
              </span>
            )}
            {(priceRange.min || priceRange.max) && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                Precio: {priceRange.min || '0'} - {priceRange.max || '∞'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuFilters;