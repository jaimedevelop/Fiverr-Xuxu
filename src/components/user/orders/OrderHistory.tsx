import React, { useState, useEffect } from 'react';
import { Search, Calendar, Download, Filter, Eye } from 'lucide-react';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import DataTable from '../../../components/common/DataTable';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { getButtonClass, colors } from '../../../utils/themeHelper';

interface Order {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: any[];
  total: number;
  userId: string;
  businessId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  estimatedDeliveryTime?: Date;
  notes?: string;
}

interface OrderHistoryProps {
  loading?: boolean;
  error?: string | null;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({
  loading = false,
  error = null
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { authState } = useAuth();
  const currentUser = authState.user;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const ordersData: Order[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ordersData.push({
            id: doc.id,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
            status: data.status,
            items: data.items,
            total: data.total,
            userId: data.userId,
            businessId: data.businessId,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            customerAddress: data.customerAddress,
            paymentMethod: data.paymentMethod,
            paymentStatus: data.paymentStatus,
            estimatedDeliveryTime: data.estimatedDeliveryTime ? data.estimatedDeliveryTime.toDate() : undefined,
            notes: data.notes
          });
        });
        
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  useEffect(() => {
    let result = orders;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          result = result.filter(order => order.createdAt >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          result = result.filter(order => order.createdAt >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          result = result.filter(order => order.createdAt >= filterDate);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          result = result.filter(order => order.createdAt >= filterDate);
          break;
      }
    }
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'preparing', label: 'Preparando' },
    { value: 'ready', label: 'Listo para Recoger' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  const dateOptions = [
    { value: 'all', label: 'Todas las Fechas' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Última Semana' },
    { value: 'month', label: 'Último Mes' },
    { value: 'year', label: 'Último Año' },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
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
        return <span className="badge-warning">Pendiente</span>;
      case 'confirmed':
        return <span className="badge-info">Confirmado</span>;
      case 'preparing':
        return <span className="badge-base bg-purple-100 text-purple-800">Preparando</span>;
      case 'ready':
        return <span className="badge-success">Listo para Recoger</span>;
      case 'delivered':
        return <span className="badge-base bg-gray-100 text-gray-800">Entregado</span>;
      case 'cancelled':
        return <span className="badge-error">Cancelado</span>;
      default:
        return <span className="badge-base bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleViewDetails = (order: Order) => {
    // In a real app, this would open a modal or navigate to a details page
    alert(`Ver detalles de la orden: ${order.id}`);
  };

  const handleDownloadReceipt = (order: Order) => {
    // In a real app, this would generate and download a PDF receipt
    alert(`Descargando recibo para la orden: ${order.id}`);
  };

  const handleExportHistory = () => {
    // In a real app, this would export the order history to CSV or Excel
    alert('Exportando historial de pedidos...');
  };

  const columns = [
    {
      key: 'id' as keyof Order,
      title: 'ID de Orden',
      render: (row: Order) => <span className="text-sm font-medium text-gray-700">#{row.id.slice(-8)}</span>
    },
    {
      key: 'createdAt' as keyof Order,
      title: 'Fecha',
      render: (row: Order) => <span className="text-sm text-gray-600">{formatDate(row.createdAt)}</span>
    },
    {
      key: 'status' as keyof Order,
      title: 'Estado',
      render: (row: Order) => getStatusBadge(row.status)
    },
    {
      key: 'total' as keyof Order,
      title: 'Total',
      render: (row: Order) => <span className="text-sm font-semibold text-gray-700">{formatCurrency(row.total)}</span>
    },
    {
      key: 'items' as keyof Order,
      title: 'Artículos',
      render: (row: Order) => (
        <span className="text-sm text-gray-700 bg-saffron-100 px-2 py-1 rounded-full">
          {row.items.length} item{row.items.length !== 1 ? 's' : ''}
        </span>
      )
    },
    {
      key: 'paymentMethod' as keyof Order,
      title: 'Método de Pago',
      render: (row: Order) => <span className="text-sm text-gray-700">{row.paymentMethod}</span>
    },
    {
      key: 'paymentStatus' as keyof Order,
      title: 'Estado de Pago',
      render: (row: Order) => (
        <span className={`text-sm font-medium badge-base ${
          row.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
          row.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          row.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.paymentStatus === 'paid' ? 'Pagado' : 
           row.paymentStatus === 'pending' ? 'Pendiente' : 
           row.paymentStatus === 'failed' ? 'Fallido' : 'Reembolsado'}
        </span>
      )
    },
    {
      key: 'id' as keyof Order,
      title: 'Acciones',
      render: (row: Order) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-2 text-saffron-600 hover:text-saffron-800 hover:bg-saffron-100 rounded-lg transition-all duration-200"
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </button>
          {row.status === 'delivered' && (
            <button
              onClick={() => handleDownloadReceipt(row)}
              className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all duration-200"
              title="Descargar recibo"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  // Calculate statistics
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'confirmed').length;

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-interactive p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-700 mb-1">{totalOrders}</p>
            <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
          </div>
        </div>
        
        <div className="card-interactive p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-saffron-600 mb-1">{formatCurrency(totalSpent)}</p>
            <p className="text-sm font-medium text-gray-600">Total Gastado</p>
          </div>
        </div>
        
        <div className="card-interactive p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600 mb-1">{deliveredOrders}</p>
            <p className="text-sm font-medium text-gray-600">Pedidos Entregados</p>
          </div>
        </div>
        
        <div className="card-interactive p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-persian-pink-600 mb-1">{pendingOrders}</p>
            <p className="text-sm font-medium text-gray-600">Pedidos Pendientes</p>
          </div>
        </div>
      </div>
      
      {/* Order History Table */}
      <div className="card-base p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Historial de Pedidos</h2>
          <p className="text-gray-600">Revisa todos tus pedidos anteriores y su estado actual</p>
        </div>

        {error && (
          <div className="mb-6 card-base p-4 border border-red-200 bg-red-50">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-saffron-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-base pl-10 w-full"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-base w-48"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-base w-48"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleExportHistory}
              className={`${getButtonClass('outline')} flex items-center gap-2`}
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Results info */}
        {filteredOrders.length !== orders.length && orders.length > 0 && (
          <div className="mb-4 card-base p-3 bg-gradient-to-r from-saffron-50 to-persian-pink-50 border border-saffron-200">
            <p className="text-sm text-saffron-700">
              Mostrando {filteredOrders.length} de {orders.length} pedidos
            </p>
          </div>
        )}

        {isLoading || loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
              <p className="text-gray-600 font-medium">Cargando historial de pedidos...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              {orders.length === 0 ? 'No tienes pedidos aún' : 'No se encontraron pedidos'}
            </h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0 
                ? 'Cuando realices tu primer pedido, aparecerá aquí.'
                : 'Intenta cambiar los filtros para ver más pedidos.'
              }
            </p>
            {orders.length === 0 && (
              <button
                onClick={() => window.location.href = '/explorar'}
                className={getButtonClass('primary')}
              >
                Explorar Postres
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-saffron-200">
            <DataTable
              columns={columns}
              data={filteredOrders}
              emptyMessage="No se encontraron pedidos en tu historial"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;