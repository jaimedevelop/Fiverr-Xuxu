import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, Tag, Percent } from 'lucide-react';
import Button from '../../../components/ui/Button';
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'Porcentaje';
      case 'fixed_amount':
        return 'Monto Fijo';
      case 'buy_one_get_one':
        return '2x1';
      case 'free_shipping':
        return 'Envío Gratis';
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="h-4 w-4" />;
      case 'fixed_amount':
        return <Tag className="h-4 w-4" />;
      case 'buy_one_get_one':
        return <Tag className="h-4 w-4" />;
      case 'free_shipping':
        return <Tag className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
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
      ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
      : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Inactivo</span>;
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
        <div>
          <div className="text-sm font-medium text-gray-900">{row.title}</div>
          <div className="text-xs text-gray-500">{row.description}</div>
          {row.code && (
            <div className="text-xs text-blue-600 font-medium">Código: {row.code}</div>
          )}
        </div>
      )
    },
    {
      key: 'type' as keyof Promotion,
      title: 'Tipo',
      render: (row: Promotion) => (
        <div className="flex items-center">
          <div className="mr-2 text-blue-500">
            {getTypeIcon(row.type)}
          </div>
          <span className="text-sm text-gray-900">{getTypeLabel(row.type)}</span>
        </div>
      )
    },
    {
      key: 'value' as keyof Promotion,
      title: 'Valor',
      render: (row: Promotion) => (
        <span className="text-sm font-medium text-gray-900">{getValueDisplay(row)}</span>
      )
    },
    {
      key: 'startDate' as keyof Promotion,
      title: 'Fechas',
      render: (row: Promotion) => (
        <div className="text-sm text-gray-900">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            {formatDate(row.startDate)}
          </div>
          <div className="flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            {formatDate(row.endDate)}
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
      render: (row: Promotion) => (
        <div>
          <div className="text-sm text-gray-900">
            {row.usedCount} / {row.usageLimit}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full ${getUsagePercentage(row) > 80 ? 'bg-red-600' : 'bg-blue-600'}`} 
              style={{ width: `${getUsagePercentage(row)}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      key: 'id' as keyof Promotion,
      title: 'Acciones',
      render: (row: Promotion) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => onView(row)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => onEdit(row)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDelete(row.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <BaseCard title="Promociones">
      {error && <div className="mb-6"><FormError message={error} /></div>}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Buscar promociones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex space-x-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
            className="w-40"
          />
          
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={typeOptions}
            className="w-40"
          />
          
          <Button onClick={() => onEdit({} as Promotion)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredPromotions}
          emptyMessage="No se encontraron promociones"
        />
      )}
    </BaseCard>
  );
};

export default PromotionsList;