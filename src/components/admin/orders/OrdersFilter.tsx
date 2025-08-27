import React, { useState } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { OrderStatus } from '../../../types/order';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import FormInput from '../../../components/common/FormInput';
import { getButtonClass } from '../../../utils/themeHelper';

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
    <div className={`card-base shadow-brand-lg ${className}`}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-purple-600" />
            Filtros
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center transition-colors duration-200"
          >
            {isExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus | '')}
                  className="input-base"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desde
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hasta
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="ID o nombre del cliente"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-base placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                className={`${getButtonClass('outline')} flex items-center`}
                onClick={handleClearFilter}
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </button>
              <button
                className={`${getButtonClass('admin')} flex items-center`}
                onClick={handleApplyFilter}
              >
                <Filter className="h-4 w-4 mr-1" />
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersFilter;