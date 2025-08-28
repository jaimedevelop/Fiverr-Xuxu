import React from 'react';
import { Filter, Calendar, Search } from 'lucide-react';

interface OrderHistoryFiltersProps {
  filters: {
    status: string;
    dateRange: string;
    searchTerm: string;
  };
  onFilterChange: (filters: {
    status: string;
    dateRange: string;
    searchTerm: string;
  }) => void;
}

export const OrderHistoryFilters: React.FC<OrderHistoryFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'preparing', label: 'Preparando' },
    { value: 'ready', label: 'Listo' },
    { value: 'out-for-delivery', label: 'En camino' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Todo el tiempo' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: '3months', label: 'Últimos 3 meses' },
    { value: 'year', label: 'Este año' }
  ];

  return (
    <div className="card-base p-6 mb-6 bg-gradient-to-r from-saffron-50 to-persian-pink-50 border border-saffron-200">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gradient-saffron rounded-lg flex items-center justify-center mr-3 shadow-saffron">
          <Filter className="w-4 h-4 text-orange-800" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700">Filtros de Búsqueda</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label htmlFor="status" className="flex items-center text-sm font-medium text-gray-700">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded mr-2"></div>
            Estado del Pedido
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input-base w-full"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="dateRange" className="flex items-center text-sm font-medium text-gray-700">
            <div className="w-4 h-4 bg-gradient-mint rounded mr-2"></div>
            Rango de Fecha
          </label>
          <select
            id="dateRange"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="input-base w-full"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="search" className="flex items-center text-sm font-medium text-gray-700">
            <div className="w-4 h-4 bg-gradient-pink rounded mr-2"></div>
            Búsqueda
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-persian-pink-400" />
            </div>
            <input
              type="text"
              id="search"
              placeholder="Buscar pedidos por ID o nombre..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="input-base w-full pl-10"
            />
          </div>
        </div>
      </div>

      {/* Active filters indicator */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.status !== 'all' && (
          <span className="badge-base bg-purple-100 text-purple-800 flex items-center gap-1">
            Estado: {statusOptions.find(o => o.value === filters.status)?.label}
            <button
              onClick={() => handleFilterChange('status', 'all')}
              className="ml-1 hover:text-purple-900"
            >
              ×
            </button>
          </span>
        )}
        
        {filters.dateRange !== 'all' && (
          <span className="badge-base bg-emerald-100 text-emerald-800 flex items-center gap-1">
            Fecha: {dateRangeOptions.find(o => o.value === filters.dateRange)?.label}
            <button
              onClick={() => handleFilterChange('dateRange', 'all')}
              className="ml-1 hover:text-emerald-900"
            >
              ×
            </button>
          </span>
        )}
        
        {filters.searchTerm && (
          <span className="badge-base bg-persian-pink-100 text-persian-pink-800 flex items-center gap-1">
            Búsqueda: "{filters.searchTerm}"
            <button
              onClick={() => handleFilterChange('searchTerm', '')}
              className="ml-1 hover:text-persian-pink-900"
            >
              ×
            </button>
          </span>
        )}
        
        {(filters.status !== 'all' || filters.dateRange !== 'all' || filters.searchTerm) && (
          <button
            onClick={() => onFilterChange({ status: 'all', dateRange: 'all', searchTerm: '' })}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Limpiar todos los filtros
          </button>
        )}
      </div>
    </div>
  );
};