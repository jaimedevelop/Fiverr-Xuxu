import React, { useState, useEffect } from 'react';
import { useOrders } from '../../contexts/OrderContext';
import { useUser } from '../../contexts/UserContext';
import BaseCard from '../../components/common/BaseCard';
import DataTable from '../../components/common/DataTable';
import { Order, OrderStatus } from '../../types/order';
import { formatCurrency, formatDate } from '../../utils/formatting';
import { ClipboardList, Clock, Package, CheckCircle, RefreshCw, AlertTriangle, Users } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrders();
  const { user } = useUser();

  // Reduced logging to prevent console spam
  console.log('🏢 Admin Orders Page - User:', user?.businessId, 'Orders:', orders.length);

  useEffect(() => {
    // Only fetch if we have a businessId and no orders are currently loaded
    if (user?.businessId && orders.length === 0 && !loading) {
      console.log('✅ Fetching orders for businessId:', user.businessId);
      fetchOrders();
    }
  }, [user?.businessId, fetchOrders, orders.length, loading]);

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap = {
      'pending': { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'confirmed': { label: 'Confirmado', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'preparing': { label: 'Preparando', class: 'bg-purple-100 text-purple-800 border-purple-200' },
      'ready': { label: 'Listo', class: 'bg-green-100 text-green-800 border-green-200' },
      'delivered': { label: 'Entregado', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      'cancelled': { label: 'Cancelado', class: 'bg-red-100 text-red-800 border-red-200' },
    };

    const statusInfo = statusMap[status] || { label: status || 'Desconocido', class: 'bg-gray-100 text-gray-800 border-gray-200' };
    
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    console.log('🔄 Admin updating order status:', orderId, 'to:', newStatus);
    try {
      await updateOrderStatus(orderId, newStatus);
      console.log('✅ Order status updated successfully');
    } catch (error) {
      console.error('❌ Error updating order status:', error);
    }
  };

  const handleViewOrder = (orderId: string) => {
    console.log('👀 Admin viewing order details:', orderId);
    setSelectedOrderId(orderId);
  };

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh clicked');
    fetchOrders();
  };

  const columns = [
    {
      key: 'id' as keyof Order,
      title: 'ID de Pedido',
      render: (value: any, row: Order) => (
        <span className="text-sm font-medium text-gray-900">
          #{row.id ? row.id.slice(-6) : 'N/A'}
        </span>
      )
    },
    {
      key: 'createdAt' as keyof Order,
      title: 'Fecha',
      render: (value: any, row: Order) => (
        <span className="text-sm text-gray-500">
          {row.createdAt ? formatDate(row.createdAt) : 'N/A'}
        </span>
      )
    },
    {
      key: 'status' as keyof Order,
      title: 'Estado',
      render: (value: any, row: Order) => getStatusBadge(row.status)
    },
    {
      key: 'total' as keyof Order,
      title: 'Total',
      render: (value: any, row: Order) => (
        <span className="text-sm font-medium text-gray-900">
          {row.total ? formatCurrency(row.total) : '$0.00'}
        </span>
      )
    },
    {
      key: 'items' as keyof Order,
      title: 'Artículos',
      render: (value: any, row: Order) => (
        <span className="text-sm text-gray-900">
          {row.items?.length || 0}
        </span>
      )
    },
    {
      key: 'fulfillmentType' as keyof Order,
      title: 'Tipo',
      render: (value: any, row: Order) => (
        <span className="text-sm text-gray-900">
          {row.fulfillmentType === 'delivery' ? 'Entrega' : 
           row.fulfillmentType === 'pickup' ? 'Recogida' : 'N/A'}
        </span>
      )
    },
    {
      key: 'userId' as keyof Order,
      title: 'Cliente',
      render: (value: any, row: Order) => (
        <span className="text-sm text-gray-900">
          {row.userId ? row.userId.slice(-6) : 'N/A'}
        </span>
      )
    },
    {
      key: 'actions' as any,
      title: 'Acciones',
      render: (value: any, row: Order) => (
        <div className="flex space-x-2">
          <button
            onClick={() => row.id && handleViewOrder(row.id)}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors duration-200"
            disabled={!row.id}
          >
            Ver
          </button>
          {row.status !== 'delivered' && row.status !== 'cancelled' && row.id && (
            <select
              onChange={(e) => handleStatusUpdate(row.id, e.target.value as OrderStatus)}
              value={row.status || 'pending'}
              className="text-xs border border-gray-300 rounded-md px-2 py-1 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
            >
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="preparing">Preparando</option>
              <option value="ready">Listo</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-sm">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-6" />
              <h3 className="text-xl font-semibold text-red-800 mb-3">Error al cargar pedidos</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={handleManualRefresh}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={18} />
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.businessId) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 shadow-sm">
            <div className="text-center">
              <Users className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
              <h3 className="text-xl font-semibold text-yellow-800 mb-3">Sin acceso a pedidos</h3>
              <p className="text-yellow-700 mb-6">Tu cuenta no está asociada a un negocio.</p>
              <div className="bg-yellow-100 rounded-lg p-4 text-sm text-yellow-700 space-y-2">
                <p><span className="font-medium">User ID:</span> {user?.id || 'No disponible'}</p>
                <p><span className="font-medium">Business ID:</span> {user?.businessId || 'No disponible'}</p>
                <p><span className="font-medium">Role:</span> {user?.role || 'No disponible'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  Gestión de Pedidos
                </h1>
                <p className="text-lg text-gray-600">
                  Administra y supervisa todos los pedidos de tu negocio
                </p>
              </div>
              <div className="hidden sm:block">
                <button
                  onClick={handleManualRefresh}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3"
                >
                  <RefreshCw size={18} />
                  Actualizar
                </button>
              </div>
            </div>
          </div>

          {/* Orders Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{orders.length}</p>
                  <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-yellow-600 mb-1">
                    {orders.filter(order => order.status === 'pending').length}
                  </p>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {orders.filter(order => ['confirmed', 'preparing'].includes(order.status)).length}
                  </p>
                  <p className="text-sm font-medium text-gray-600">En Proceso</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    {orders.filter(order => order.status === 'delivered').length}
                  </p>
                  <p className="text-sm font-medium text-gray-600">Completados</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Lista de Pedidos
              </h2>
              <p className="text-gray-600">
                {orders.length === 0 
                  ? 'No hay pedidos registrados en tu negocio' 
                  : `${orders.length} pedidos encontrados`
                }
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClipboardList className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No hay pedidos</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Aún no has recibido ningún pedido para tu negocio. Los pedidos aparecerán aquí cuando los clientes realicen compras.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 max-w-xs mx-auto mb-6">
                  <p><span className="font-medium">Business ID:</span> {user?.businessId}</p>
                </div>
                <button
                  onClick={handleManualRefresh}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={18} />
                  Actualizar Pedidos
                </button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <DataTable
                  columns={columns}
                  data={orders}
                  emptyMessage="No se encontraron pedidos"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;