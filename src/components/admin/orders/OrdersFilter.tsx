import React, { useState } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { OrderStatus } from '../../../types/order';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import FormInput from '../../../components/common/FormInput';

interface OrdersFilterProps {
  onFilter: (filters: {
    status?: OrderStatus;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
  }) => void;
  onClear: () => void;
  className?: string;
}

const OrdersFilter: React.FC<OrdersFilterProps> = ({ onFilter, onClear, className = '' }) => {
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'preparing', label: 'Preparando' },
    { value: 'ready', label: 'Listo' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  const handleApplyFilter = () => {
    const filters: any = {};
    
    if (status) filters.status = status;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);
    if (search) filters.search = search;
    
    onFilter(filters);
  };

  const handleClearFilter = () => {
    setStatus('');
    setDateFrom('');
    setDateTo('');
    setSearch('');
    onClear();
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtros
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          {isExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus | '')}
                options={statusOptions}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desde
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hasta
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                placeholder="ID o nombre del cliente"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2 border-t">
            <Button
              variant="outline"
              onClick={handleClearFilter}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
            <Button
              onClick={handleApplyFilter}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              Aplicar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersFilter;