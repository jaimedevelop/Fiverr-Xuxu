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
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>;
      case 'confirmed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Confirmado</span>;
      case 'preparing':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Preparando</span>;
      case 'ready':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Listo para Recoger</span>;
      case 'delivered':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Entregado</span>;
      case 'cancelled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelado</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
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
      render: (row: Order) => <span className="text-sm font-medium text-gray-900">{row.id}</span>
    },
    {
      key: 'createdAt' as keyof Order,
      title: 'Fecha',
      render: (row: Order) => <span className="text-sm text-gray-500">{formatDate(row.createdAt)}</span>
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
      render: (row: Order) => <span className="text-sm text-gray-900">{row.items.length}</span>
    },
    {
      key: 'paymentMethod' as keyof Order,
      title: 'Método de Pago',
      render: (row: Order) => <span className="text-sm text-gray-900">{row.paymentMethod}</span>
    },
    {
      key: 'paymentStatus' as keyof Order,
      title: 'Estado de Pago',
      render: (row: Order) => (
        <span className={`text-sm font-medium ${
          row.paymentStatus === 'paid' ? 'text-green-600' : 
          row.paymentStatus === 'pending' ? 'text-yellow-600' : 
          row.paymentStatus === 'failed' ? 'text-red-600' : 'text-gray-600'
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
          <Button
            variant="outline"
            onClick={() => handleViewDetails(row)}
            className="h-8 w-8 p-0"
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'delivered' && (
            <Button
              variant="outline"
              onClick={() => handleDownloadReceipt(row)}
              className="h-8 w-8 p-0"
              title="Descargar recibo"
            >
              <Download className="h-4 w-4" />
            </Button>
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
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseCard>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-sm text-gray-500">Total de Pedidos</p>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
            <p className="text-sm text-gray-500">Total Gastado</p>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
            <p className="text-sm text-gray-500">Pedidos Entregados</p>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            <p className="text-sm text-gray-500">Pedidos Pendientes</p>
          </div>
        </BaseCard>
      </div>
      
      {/* Order History Table */}
      <BaseCard title="Historial de Pedidos">
        {error && <div className="mb-6 text-red-600">{error}</div>}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              className="w-48"
            />
            
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              options={dateOptions}
              className="w-48"
            />
            
            <Button
              variant="outline"
              onClick={handleExportHistory}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {isLoading || loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredOrders}
            emptyMessage="No se encontraron pedidos en tu historial"
          />
        )}
      </BaseCard>
    </div>
  );
};

export default OrderHistory;