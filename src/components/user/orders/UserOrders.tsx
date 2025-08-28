import React, { useState, useEffect } from 'react';
import { Search, Eye, RefreshCw } from 'lucide-react';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import DataTable from '../../../components/common/DataTable';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import OrderTracking from './OrderTracking';

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

interface UserOrdersProps {
  loading?: boolean;
  error?: string | null;
}

const UserOrders: React.FC<UserOrdersProps> = ({
  loading = false,
  error = null
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
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
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            status: data.status || 'pending',
            items: data.items || [],
            total: data.total || 0,
            userId: data.userId || '',
            businessId: data.businessId || '',
            customerName: data.customerName || '',
            customerEmail: data.customerEmail || '',
            customerPhone: data.customerPhone || '',
            customerAddress: data.customerAddress || '',
            paymentMethod: data.paymentMethod || '',
            paymentStatus: data.paymentStatus || 'pending',
            estimatedDeliveryTime: data.estimatedDeliveryTime ? data.estimatedDeliveryTime.toDate() : undefined,
            notes: data.notes || ''
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
        order.id.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter]);

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'preparing', label: 'Preparando' },
    { value: 'ready', label: 'Listo para Recoger' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'N/A';
    try {
      return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '$0.00';
    }
    try {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `$${amount.toFixed(2)}`;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="badge-base bg-yellow-100 text-yellow-800 font-semibold">Pendiente</span>;
      case 'confirmed':
        return <span className="badge-base bg-blue-100 text-blue-800 font-semibold">Confirmado</span>;
      case 'preparing':
        return <span className="badge-base bg-purple-100 text-purple-800 font-semibold">Preparando</span>;
      case 'ready':
        return <span className="badge-success font-semibold">Listo para Recoger</span>;
      case 'delivered':
        return <span className="badge-base bg-gray-100 text-gray-800 font-semibold">Entregado</span>;
      case 'cancelled':
        return <span className="badge-base bg-red-100 text-red-800 font-semibold">Cancelado</span>;
      default:
        return <span className="badge-base bg-gray-100 text-gray-800 font-semibold">{status}</span>;
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrderId(order.id);
    setShowOrderTracking(true);
  };

  const handleCloseTracking = () => {
    setShowOrderTracking(false);
    setSelectedOrderId('');
  };

  const handleRefresh = async () => {
    if (!currentUser) {
      return;
    }

    try {
      setIsLoading(true);
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
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          status: data.status || 'pending',
          items: data.items || [],
          total: data.total || 0,
          userId: data.userId || '',
          businessId: data.businessId || '',
          customerName: data.customerName || '',
          customerEmail: data.customerEmail || '',
          customerPhone: data.customerPhone || '',
          customerAddress: data.customerAddress || '',
          paymentMethod: data.paymentMethod || '',
          paymentStatus: data.paymentStatus || 'pending',
          estimatedDeliveryTime: data.estimatedDeliveryTime ? data.estimatedDeliveryTime.toDate() : undefined,
          notes: data.notes || ''
        });
      });
      
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (err) {
      console.error('Error refreshing orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'id',
      title: 'ID de Orden',
      render: (value: any, row: Order) => (
        <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-lg">
          #{row.id.slice(-6).toUpperCase()}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: 'Fecha',
      render: (value: any, row: Order) => (
        <span className="text-sm text-gray-600">{formatDate(row.createdAt)}</span>
      )
    },
    {
      key: 'status',
      title: 'Estado',
      render: (value: any, row: Order) => getStatusBadge(row.status)
    },
    {
      key: 'total',
      title: 'Total',
      render: (value: any, row: Order) => (
        <span className="text-sm font-bold text-saffron-600">{formatCurrency(row.total)}</span>
      )
    },
    {
      key: 'items',
      title: 'Artículos',
      render: (value: any, row: Order) => (
        <div className="flex items-center">
          <span className="bg-gray-100 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
            {row.items?.length || 0}
          </span>
        </div>
      )
    },
    {
      key: 'paymentMethod',
      title: 'Método de Pago',
      render: (value: any, row: Order) => (
        <span className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-lg">
          {row.paymentMethod || 'N/A'}
        </span>
      )
    },
    {
      key: 'estimatedDeliveryTime',
      title: 'Tiempo Estimado',
      render: (value: any, row: Order) => (
        <span className="text-xs text-gray-600">
          {formatDate(row.estimatedDeliveryTime)}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (value: any, row: Order) => (
        <Button
          onClick={() => handleViewDetails(row)}
          className="btn-outline h-8 w-8 p-0 hover:bg-saffron-50 hover:border-saffron-300"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <>
      <div className="card-base bg-gradient-main p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mis Órdenes</h1>
          <div className="bg-saffron-100 px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-orange-900">
              {filteredOrders.length} órdenes
            </span>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-coral-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar órdenes por ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-base pl-10 w-full"
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
            

                        <Button
            onClick={handleRefresh}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
              isLoading 
                ? 'opacity-75 cursor-not-allowed bg-gray-100 text-gray-400 transform-none' 
                : 'bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-saffron-50 hover:text-saffron-700 hover:scale-105 focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2'
            }`}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </Button>
          </div>
        </div>

        {isLoading || loading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-saffron-200 border-t-saffron-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando órdenes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay órdenes</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron órdenes que coincidan con los filtros' 
                : 'Aún no has realizado ninguna orden'
              }
            </p>
          </div>
        ) : (
          <div className="card-base overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredOrders}
              emptyMessage="No se encontraron órdenes"
            />
          </div>
        )}
      </div>
      
      <OrderTracking
        isOpen={showOrderTracking}
        onClose={handleCloseTracking}
        orderId={selectedOrderId}
      />
    </>
  );
};

export default UserOrders;