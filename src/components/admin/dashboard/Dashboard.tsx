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
  Check,
  BarChart3,
  Package,
  Timer
} from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
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
  theme: 'saffron' | 'mint' | 'pink' | 'purple';
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
  format = 'number',
  theme 
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

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'saffron':
        return {
          gradient: 'bg-gradient-saffron',
          bg: 'bg-gradient-to-br from-saffron-50 to-orange-50',
          border: 'border-saffron-200',
          iconColor: 'text-orange-900'
        };
      case 'mint':
        return {
          gradient: 'bg-gradient-mint',
          bg: 'bg-gradient-to-br from-mint-50 to-emerald-50',
          border: 'border-emerald-200',
          iconColor: 'text-emerald-700'
        };
      case 'pink':
        return {
          gradient: 'bg-gradient-pink',
          bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
          border: 'border-pink-200',
          iconColor: 'text-pink-700'
        };
      case 'purple':
        return {
          gradient: 'bg-gradient-purple',
          bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
          border: 'border-purple-200',
          iconColor: 'text-white'
        };
      default:
        return {
          gradient: 'bg-gradient-saffron',
          bg: 'bg-gradient-to-br from-saffron-50 to-orange-50',
          border: 'border-saffron-200',
          iconColor: 'text-orange-900'
        };
    }
  };

  const themeClasses = getThemeClasses(theme);

  return (
    <div className={`card-base p-6 ${themeClasses.bg} ${themeClasses.border} border`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${themeClasses.gradient} rounded-xl flex items-center justify-center shadow-brand-lg`}>
              <div className={themeClasses.iconColor}>
                {icon}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{formatValue(value)}</span>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  isPositive ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(change)}%</span>
                </div>
              </div>
            </div>
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
        return <span className="badge-base bg-amber-100 text-amber-800">Pendiente</span>;
      case 'confirmed':
        return <span className="badge-base bg-blue-100 text-blue-800">Confirmado</span>;
      case 'preparing':
        return <span className="badge-base bg-purple-100 text-purple-800">Preparando</span>;
      case 'ready':
        return <span className="badge-success">Listo</span>;
      case 'completed':
        return <span className="badge-base bg-gray-100 text-gray-800">Completado</span>;
      case 'cancelled':
        return <span className="badge-closed">Cancelado</span>;
      default:
        return <span className="badge-base bg-gray-100 text-gray-800">{status}</span>;
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
      render: (row: Order) => (
        <span className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
          {row.id}
        </span>
      )
    },
    {
      key: 'customer' as keyof Order,
      title: 'Cliente',
      render: (row: Order) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-saffron rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-orange-900" />
          </div>
          <span className="text-sm font-medium text-gray-900">{row.customer}</span>
        </div>
      )
    },
    {
      key: 'date' as keyof Order,
      title: 'Fecha',
      render: (row: Order) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{formatDate(row.date)}</span>
        </div>
      )
    },
    {
      key: 'status' as keyof Order,
      title: 'Estado',
      render: (row: Order) => getStatusBadge(row.status)
    },
    {
      key: 'total' as keyof Order,
      title: 'Total',
      render: (row: Order) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-500" />
          <span className="text-sm font-semibold text-gray-900">{formatCurrency(row.total)}</span>
        </div>
      )
    },
    {
      key: 'items' as keyof Order,
      title: 'Artículos',
      render: (row: Order) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900">{row.items}</span>
        </div>
      )
    }
  ];

  const lowStockColumns = [
    {
      key: 'name' as keyof LowStockItem,
      title: 'Producto',
      render: (row: LowStockItem) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
            <Package className="h-4 w-4 text-amber-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">{row.name}</span>
        </div>
      )
    },
    {
      key: 'category' as keyof LowStockItem,
      title: 'Categoría',
      render: (row: LowStockItem) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {row.category}
        </span>
      )
    },
    {
      key: 'currentStock' as keyof LowStockItem,
      title: 'Stock Actual',
      render: (row: LowStockItem) => (
        <span className={`text-sm font-semibold ${
          row.currentStock === 0 ? 'text-red-600' : 'text-amber-600'
        }`}>
          {row.currentStock}
        </span>
      )
    },
    {
      key: 'minStock' as keyof LowStockItem,
      title: 'Stock Mínimo',
      render: (row: LowStockItem) => <span className="text-sm font-medium text-gray-700">{row.minStock}</span>
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="card-base p-8 max-w-sm mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-saffron rounded-full flex items-center justify-center animate-pulse">
              <BarChart3 className="w-8 h-8 text-orange-900" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <p className="text-gray-600 font-medium">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-saffron rounded-xl flex items-center justify-center shadow-brand-lg">
                <BarChart3 className="w-6 h-6 text-orange-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Resumen completo de tu negocio de repostería</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                options={timeRangeOptions}
                className="input-base w-40"
              />
              
              <button
                onClick={handleRefresh}
                className={getButtonClass('outline')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Ingresos del Día"
              value={metrics.revenue}
              change={metrics.revenueChange}
              icon={<DollarSign className="h-6 w-6" />}
              format="currency"
              theme="saffron"
            />
            <MetricCard
              title="Órdenes Totales"
              value={metrics.orders}
              change={metrics.ordersChange}
              icon={<ShoppingCart className="h-6 w-6" />}
              theme="mint"
            />
            <MetricCard
              title="Clientes Únicos"
              value={metrics.customers}
              change={metrics.customersChange}
              icon={<Users className="h-6 w-6" />}
              theme="pink"
            />
            <MetricCard
              title="Ticket Promedio"
              value={metrics.avgOrderValue}
              change={metrics.avgOrderValueChange}
              icon={<TrendingUp className="h-6 w-6" />}
              format="currency"
              theme="purple"
            />
          </div>

          {/* Recent Orders & Low Stock */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Recent Orders */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Órdenes Recientes</h2>
              </div>
              
              <BaseCard>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <DataTable
                      columns={orderColumns}
                      data={recentOrders}
                      emptyMessage="No se encontraron órdenes recientes"
                    />
                  </div>
                )}
              </BaseCard>
            </div>

            {/* Low Stock Alerts */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Alertas de Stock</h2>
              </div>
              
              <BaseCard>
                {lowStockItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Todo en orden!</h3>
                    <p className="text-gray-600">No hay productos con stock bajo en este momento.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        {lowStockItems.length} producto{lowStockItems.length !== 1 ? 's' : ''} con stock bajo
                      </p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Requiere atención
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <DataTable
                        columns={lowStockColumns}
                        data={lowStockItems}
                        emptyMessage="No se encontraron productos con stock bajo"
                      />
                    </div>
                  </div>
                )}
              </BaseCard>
            </div>
          </div>

          {/* Upcoming Orders */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Próximas Órdenes</h2>
            </div>
            
            <BaseCard>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Timer className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Órdenes Programadas para Hoy</h3>
                    <p className="text-blue-800 mb-4">
                      Tienes <span className="font-semibold">3 órdenes programadas</span> para completar hoy. 
                      La próxima orden estará lista a las <span className="font-semibold">15:30</span>.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">15:30</span>
                          <span className="text-gray-600">- Pastel de bodas</span>
                        </div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">17:00</span>
                          <span className="text-gray-600">- Cupcakes cumpleaños</span>
                        </div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">18:30</span>
                          <span className="text-gray-600">- Galletas decoradas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;