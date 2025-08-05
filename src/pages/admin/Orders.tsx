import React, { useState } from 'react';
import { FileText, Package } from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';
import { Order, OrderStatus } from '../../types/order';
import OrdersFilter from '../../components/admin/orders/OrdersFilter';
import OrdersList from '../../components/admin/orders/OrdersList';
import OrderDetails from '../../components/admin/orders/OrderDetails';
import BaseCard from '../../components/common/BaseCard';
import FormError from '../../components/common/FormError';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminOrders: React.FC = () => {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);

  const handleViewDetails = (order: Order) => {
    setSelectedOrderId(order.id);
    setIsDetailView(true);
  };

  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedOrderId(null);
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  const handleFilter = (filters: any) => {
    fetchOrders(filters);
  };

  const handleClearFilter = () => {
    fetchOrders();
  };

  // Render order statistics
  const renderStats = () => {
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const preparingOrders = orders.filter(order => order.status === 'preparing').length;
    const readyOrders = orders.filter(order => order.status === 'ready').length;
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Preparando</p>
              <p className="text-2xl font-bold text-gray-900">{preparingOrders}</p>
            </div>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Listos</p>
              <p className="text-2xl font-bold text-gray-900">{readyOrders}</p>
            </div>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Entregados</p>
              <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
            </div>
          </div>
        </BaseCard>
      </div>
    );
  };

  if (isDetailView && selectedOrderId) {
    return (
      <div className="p-6">
        <OrderDetails
          orderId={selectedOrderId}
          onBack={handleBackToList}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600">Gestiona y da seguimiento a todos los pedidos</p>
      </div>

      {error && <div className="mb-6"><FormError message={error} /></div>}

      {renderStats()}

      <div className="mb-6">
        <OrdersFilter
          onFilter={handleFilter}
          onClear={handleClearFilter}
        />
      </div>

      <BaseCard>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <OrdersList
            orders={orders}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            loading={loading}
          />
        )}
      </BaseCard>
    </div>
  );
};

export default AdminOrders;