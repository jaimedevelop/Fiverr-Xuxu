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
        <span className="text-sm font-medium text-gray-900">{row.id}</span>
      )
    },
    {
      key: 'createdAt',
      title: 'Fecha',
      render: (value: any, row: Order) => (
        <span className="text-sm text-gray-500">{formatDate(row.createdAt)}</span>
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
        <span className="text-sm font-medium text-gray-900">{formatCurrency(row.total)}</span>
      )
    },
    {
      key: 'items',
      title: 'Artículos',
      render: (value: any, row: Order) => (
        <span className="text-sm text-gray-900">{row.items?.length || 0}</span>
      )
    },
    {
      key: 'paymentMethod',
      title: 'Método de Pago',
      render: (value: any, row: Order) => (
        <span className="text-sm text-gray-900">{row.paymentMethod || 'N/A'}</span>
      )
    },
    {
      key: 'estimatedDeliveryTime',
      title: 'Tiempo Estimado',
      render: (value: any, row: Order) => (
        <span className="text-sm text-gray-900">
          {formatDate(row.estimatedDeliveryTime)}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (value: any, row: Order) => (
        <Button
          variant="outline"
          onClick={() => handleViewDetails(row)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <>
      <BaseCard title="Mis Órdenes">
        {error && <div className="mb-6 text-red-600">{error}</div>}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar órdenes..."
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
            
            <Button
              variant="outline"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
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
            emptyMessage="No se encontraron órdenes"
          />
        )}
      </BaseCard>
      
      <OrderTracking
        isOpen={showOrderTracking}
        onClose={handleCloseTracking}
        orderId={selectedOrderId}
      />
    </>
  );
};

export default UserOrders;