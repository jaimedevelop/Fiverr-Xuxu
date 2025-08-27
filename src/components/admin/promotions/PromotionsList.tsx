import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, Tag, Percent, DollarSign, Gift, Truck, Search, Filter, Users, TrendingUp } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
import BaseCard from '../../../components/common/BaseCard';
import DataTable from '../../../components/common/DataTable';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';
import FormError from '../../../components/common/FormError';

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'free_shipping';
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  applicableItems: string[];
  code?: string;
}

interface PromotionsListProps {
  loading?: boolean;
  error?: string | null;
  onEdit?: (promotion: Promotion) => void;
  onDelete?: (promotionId: string) => void;
  onView?: (promotion: Promotion) => void;
}

const PromotionsList: React.FC<PromotionsListProps> = ({ 
  loading = false, 
  error = null,
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {}
}) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data for development
    const mockPromotions: Promotion[] = [
      {
        id: '1',
        title: 'Descuento de Verano',
        description: '20% de descuento en todos los pasteles',
        type: 'percentage',
        value: 20,
        startDate: new Date(2023, 5, 1),
        endDate: new Date(2023, 7, 31),
        isActive: true,
        usageLimit: 100,
        usedCount: 45,
        applicableItems: ['item1', 'item2', 'item3'],
        code: 'VERANO20'
      },
      {
        id: '2',
        title: '2x1 en Cupcakes',
        description: 'Lleva dos cupcakes y paga solo uno',
        type: 'buy_one_get_one',
        value: 0,
        startDate: new Date(2023, 5, 15),
        endDate: new Date(2023, 6, 15),
        isActive: true,
        usageLimit: 50,
        usedCount: 12,
        applicableItems: ['item4', 'item5']
      },
      {
        id: '3',
        title: 'Envío Gratis',
        description: 'Envío gratis en órdenes mayores a $300',
        type: 'free_shipping',
        value: 300,
        startDate: new Date(2023, 5, 1),
        endDate: new Date(2023, 5, 31),
        isActive: false,
        usageLimit: 200,
        usedCount: 78,
        applicableItems: []
      },
      {
        id: '4',
        title: 'Descuento Fijo',
        description: '$50 de descuento en órdenes mayores a $200',
        type: 'fixed_amount',
        value: 50,
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 5, 15),
        isActive: false,
        usageLimit: 75,
        usedCount: 60,
        applicableItems: ['item1', 'item3', 'item6'],
        code: 'FIJO50'
      }
    ];
    setPromotions(mockPromotions);
    setFilteredPromotions(mockPromotions);
  }, []);

  useEffect(() => {
    let result = promotions;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(promotion => 
        promotion.title.toLowerCase().includes(term) ||
        promotion.description.toLowerCase().includes(term) ||
        (promotion.code && promotion.code.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      result = result.filter(promotion => promotion.isActive === isActive);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(promotion => promotion.type === typeFilter);
    }
    
    setFilteredPromotions(result);
  }, [promotions, searchTerm, statusFilter, typeFilter]);

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ];

  const typeOptions = [
    { value: 'all', label: 'Todos los Tipos' },
    { value: 'percentage', label: 'Porcentaje' },
    { value: 'fixed_amount', label: 'Monto Fijo' },
    { value: 'buy_one_get_one', label: '2x1' },
    { value: 'free_shipping', label: 'Envío Gratis' },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'percentage':
        return { 
          label: 'Porcentaje', 
          icon: <Percent className="h-4 w-4" />,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          iconColor: 'text-purple-600'
        };
      case 'fixed_amount':
        return { 
          label: 'Monto Fijo', 
          icon: <DollarSign className="h-4 w-4" />,
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-800',
          iconColor: 'text-emerald-600'
        };
      case 'buy_one_get_one':
        return { 
          label: '2x1', 
          icon: <Gift className="h-4 w-4" />,
          bgColor: 'bg-pink-100',
          textColor: 'text-pink-800',
          iconColor: 'text-pink-600'
        };
      case 'free_shipping':
        return { 
          label: 'Envío Gratis', 
          icon: <Truck className="h-4 w-4" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600'
        };
      default:
        return { 
          label: type, 
          icon: <Tag className="h-4 w-4" />,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600'
        };
    }
  };

  const getValueDisplay = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed_amount':
        return `$${promotion.value}`;
      case 'buy_one_get_one':
        return '2x1';
      case 'free_shipping':
        return `Gratis > $${promotion.value}`;
      default:
        return `${promotion.value}`;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <span className="badge-success">Activo</span>
      : <span className="badge-closed">Inactivo</span>;
  };

  const getUsagePercentage = (promotion: Promotion) => {
    if (promotion.usageLimit === 0) return 0;
    return Math.round((promotion.usedCount / promotion.usageLimit) * 100);
  };

  const handleDelete = (promotionId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
      onDelete(promotionId);
      setPromotions(prev => prev.filter(p => p.id !== promotionId));
    }
  };

  const columns = [
    {
      key: 'title' as keyof Promotion,
      title: 'Promoción',
      render: (row: Promotion) => (
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-pink rounded-lg flex items-center justify-center flex-shrink-0">
              <Tag className="h-5 w-5 text-pink-700" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-900 truncate">{row.title}</div>
              <div className="text-xs text-gray-600 line-clamp-2">{row.description}</div>
            </div>
          </div>
          {row.code && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <Tag className="h-3 w-3 text-blue-600" />
              </div>
              <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                {row.code}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'type' as keyof Promotion,
      title: 'Tipo',
      render: (row: Promotion) => {
        const typeConfig = getTypeConfig(row.type);
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}>
            <div className={typeConfig.iconColor}>
              {typeConfig.icon}
            </div>
            <span>{typeConfig.label}</span>
          </div>
        );
      }
    },
    {
      key: 'value' as keyof Promotion,
      title: 'Valor',
      render: (row: Promotion) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-saffron rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-orange-900" />
          </div>
          <span className="text-sm font-bold text-gray-900">{getValueDisplay(row)}</span>
        </div>
      )
    },
    {
      key: 'startDate' as keyof Promotion,
      title: 'Período',
      render: (row: Promotion) => (
        <div className="text-sm">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-3 w-3 text-green-500" />
            <span className="text-gray-900 font-medium">{formatDate(row.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-red-500" />
            <span className="text-gray-600">{formatDate(row.endDate)}</span>
          </div>
        </div>
      )
    },
    {
      key: 'isActive' as keyof Promotion,
      title: 'Estado',
      render: (row: Promotion) => getStatusBadge(row.isActive)
    },
    {
      key: 'usageLimit' as keyof Promotion,
      title: 'Uso',
      render: (row: Promotion) => {
        const percentage = getUsagePercentage(row);
        return (
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {row.usedCount} / {row.usageLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`} 
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {percentage}% utilizado
            </div>
          </div>
        );
      }
    },
    {
      key: 'id' as keyof Promotion,
      title: 'Acciones',
      render: (row: Promotion) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(row)}
            className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            title="Ver detalles"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => onEdit(row)}
            className="w-8 h-8 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            title="Editar promoción"
          >
            <Edit className="h-4 w-4 text-emerald-600" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            title="Eliminar promoción"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <BaseCard>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 bg-gradient-pink rounded-full flex items-center justify-center animate-pulse mb-4">
            <Tag className="w-6 h-6 text-pink-700" />
          </div>
          <div className="space-y-2 text-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="h-3 bg-gray-100 rounded animate-pulse w-32"></div>
          </div>
          <p className="text-gray-600 font-medium mt-4">Cargando promociones...</p>
        </div>
      </BaseCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="card-base p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Lista de Promociones</h2>
              <p className="text-gray-600 text-sm">
                {filteredPromotions.length} promociones encontradas
              </p>
            </div>
          </div>
          
          <button
            onClick={() => onEdit({} as Promotion)}
            className={getButtonClass('primary')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Promoción
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar promociones por título, descripción o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-base"
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                className="pl-10 input-base"
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={typeOptions}
                className="pl-10 input-base"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Búsqueda: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:bg-blue-200 rounded-full p-0.5">
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Estado: {statusOptions.find(o => o.value === statusFilter)?.label}
                <button onClick={() => setStatusFilter('all')} className="hover:bg-purple-200 rounded-full p-0.5">
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                Tipo: {typeOptions.find(o => o.value === typeFilter)?.label}
                <button onClick={() => setTypeFilter('all')} className="hover:bg-emerald-200 rounded-full p-0.5">
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="card-base p-4 bg-red-50 border-red-200 border">
          <FormError message={error} />
        </div>
      )}

      {/* Promotions Table */}
      <BaseCard>
        {filteredPromotions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Tag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'No se encontraron promociones' 
                : 'No hay promociones creadas'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Intenta ajustar los filtros o crear una nueva promoción.'
                : 'Crea tu primera promoción para atraer más clientes con descuentos especiales.'}
            </p>
            <button
              onClick={() => onEdit({} as Promotion)}
              className={getButtonClass('primary')}
            >
              <Plus className="h-4 w-4 mr-2" />
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Nueva Promoción' 
                : 'Crear Primera Promoción'}
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredPromotions}
              emptyMessage="No se encontraron promociones"
            />
          </div>
        )}
      </BaseCard>

      {/* Quick Stats */}
      {filteredPromotions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-800">Promociones Activas</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {filteredPromotions.filter(p => p.isActive).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Usos Totales</p>
                <p className="text-2xl font-bold text-blue-900">
                  {filteredPromotions.reduce((sum, p) => sum + p.usedCount, 0)}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Tasa de Uso Promedio</p>
                <p className="text-2xl font-bold text-purple-900">
                  {filteredPromotions.length > 0 
                    ? Math.round(filteredPromotions.reduce((sum, p) => sum + getUsagePercentage(p), 0) / filteredPromotions.length)
                    : 0}%
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Percent className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsList;