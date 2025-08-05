import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  RefreshCw,
  Calendar,
  AlertCircle,
  Check
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import DataTable from '../../../components/common/DataTable';
import Select from '../../../components/ui/Select';

interface DashboardProps {
  loading?: boolean;
  error?: string | null;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  format?: 'currency' | 'number' | 'percentage';
}

interface Order {
  id: string;
  customer: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total: number;
  items: number;
}

interface LowStockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  category: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  format = 'number' 
}) => {
  const isPositive = change >= 0;
  
  const formatValue = (val: string) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(Number(val));
    } else if (format === 'percentage') {
      return `${val}%`;
    }
    return val;
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{formatValue(value)}</div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                  ) : (
                    <TrendingDown className="h-4 w-4 flex-shrink-0 self-center" />
                  )}
                  <span className="sr-only">{isPositive ? 'Increased' : 'Decreased'} by</span>
                  {Math.abs(change)}%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ 
  loading = false, 
  error = null 
}) => {
  const [timeRange, setTimeRange] = useState<string>('today');
  const [metrics, setMetrics] = useState({
    revenue: '12540',
    revenueChange: 12.5,
    orders: '42',
    ordersChange: 8.2,
    customers: '28',
    customersChange: 5.7,
    avgOrderValue: '298.57',
    avgOrderValueChange: 3.9
  });
  
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);

  useEffect(() => {
    // Mock data for development
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customer: 'Juan Pérez',
        date: new Date(2023, 5, 15, 10, 30),
        status: 'completed',
        total: 250,
        items: 2
      },
      {
        id: 'ORD-002',
        customer: 'María García',
        date: new Date(2023, 5, 15, 11, 15),
        status: 'ready',
        total: 180,
        items: 1
      },
      {
        id: 'ORD-003',
        customer: 'Carlos López',
        date: new Date(2023, 5, 15, 12, 45),
        status: 'preparing',
        total: 320,
        items: 3
      },
      {
        id: 'ORD-004',
        customer: 'Ana Martínez',
        date: new Date(2023, 5, 15, 13, 20),
        status: 'confirmed',
        total: 150,
        items: 1
      },
      {
        id: 'ORD-005',
        customer: 'Roberto Sánchez',
        date: new Date(2023, 5, 15, 14, 10),
        status: 'pending',
        total: 200,
        items: 2
      }
    ];
    
    const mockLowStockItems: LowStockItem[] = [
      {
        id: 'item1',
        name: 'Pastel de Chocolate',
        currentStock: 3,
        minStock: 5,
        category: 'Pasteles'
      },
      {
        id: 'item4',
        name: 'Cupcake de Chocolate',
        currentStock: 8,
        minStock: 10,
        category: 'Cupcakes'
      },
      {
        id: 'item6',
        name: 'Galleta de Chispas',
        currentStock: 5,
        minStock: 15,
        category: 'Galletas'
      }
    ];
    
    setRecentOrders(mockOrders);
    setLowStockItems(mockLowStockItems);
  }, []);

  const timeRangeOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mes' },
    { value: 'year', label: 'Este Año' },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>;
      case 'confirmed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Confirmado</span>;
      case 'preparing':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Preparando</span>;
      case 'ready':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Listo</span>;
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Completado</span>;
      case 'cancelled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelado</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleRefresh = () => {
    // In a real app, this would refresh the dashboard data from the API
    alert('Actualizando dashboard...');
  };

  const orderColumns = [
    {
      key: 'id' as keyof Order,
      title: 'ID',
      render: (row: Order) => <span className="text-sm font-medium text-gray-900">{row.id}</span>
    },
    {
      key: 'customer' as keyof Order,
      title: 'Cliente',
      render: (row: Order) => <span className="text-sm text-gray-900">{row.customer}</span>
    },
    {
      key: 'date' as keyof Order,
      title: 'Fecha',
      render: (row: Order) => <span className="text-sm text-gray-500">{formatDate(row.date)}</span>
    },
    {
      key: 'status' as keyof Order,
      title: 'Estado',
      render: (row: Order) => getStatusBadge(row.status)
    },
    {
      key: 'total' as keyof Order,
      title: 'Total',
      render: (row: Order) => <span className="text-sm font-medium text-gray-900">{formatCurrency(row.total)}</span>
    },
    {
      key: 'items' as keyof Order,
      title: 'Artículos',
      render: (row: Order) => <span className="text-sm text-gray-900">{row.items}</span>
    }
  ];

  const lowStockColumns = [
    {
      key: 'name' as keyof LowStockItem,
      title: 'Producto',
      render: (row: LowStockItem) => <span className="text-sm font-medium text-gray-900">{row.name}</span>
    },
    {
      key: 'category' as keyof LowStockItem,
      title: 'Categoría',
      render: (row: LowStockItem) => <span className="text-sm text-gray-900">{row.category}</span>
    },
    {
      key: 'currentStock' as keyof LowStockItem,
      title: 'Stock Actual',
      render: (row: LowStockItem) => (
        <span className={`text-sm font-medium ${
          row.currentStock === 0 ? 'text-red-600' : 'text-yellow-600'
        }`}>
          {row.currentStock}
        </span>
      )
    },
    {
      key: 'minStock' as keyof LowStockItem,
      title: 'Stock Mínimo',
      render: (row: LowStockItem) => <span className="text-sm text-gray-900">{row.minStock}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen de tu negocio</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={timeRangeOptions}
            className="w-40"
          />
          
          <Button
            variant="outline"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Ingresos"
          value={metrics.revenue}
          change={metrics.revenueChange}
          icon={<DollarSign className="h-5 w-5" />}
          format="currency"
        />
        <MetricCard
          title="Órdenes"
          value={metrics.orders}
          change={metrics.ordersChange}
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <MetricCard
          title="Clientes"
          value={metrics.customers}
          change={metrics.customersChange}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Valor Promedio de Orden"
          value={metrics.avgOrderValue}
          change={metrics.avgOrderValueChange}
          icon={<TrendingUp className="h-5 w-5" />}
          format="currency"
        />
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard title="Órdenes Recientes">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <DataTable
              columns={orderColumns}
              data={recentOrders}
              emptyMessage="No se encontraron órdenes recientes"
            />
          )}
        </BaseCard>

        {/* Low Stock Alerts */}
        <BaseCard title="Alertas de Stock Bajo">
          {lowStockItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Todo en orden</h3>
              <p className="mt-1 text-sm text-gray-500">No hay productos con stock bajo.</p>
            </div>
          ) : (
            <DataTable
              columns={lowStockColumns}
              data={lowStockItems}
              emptyMessage="No se encontraron productos con stock bajo"
            />
          )}
        </BaseCard>
      </div>

      {/* Upcoming Orders */}
      <BaseCard title="Próximas Órdenes">
        <div className="bg-blue-50 p-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Órdenes Programadas</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Tienes 3 órdenes programadas para hoy. La próxima orden está lista a las 15:30.
                </p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  );
};

export default Dashboard;