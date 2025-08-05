import React from 'react';
import OrderHistory from '../../components/user/orders/OrderHistory';

const OrderHistoryPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Historial de Pedidos</h1>
      <OrderHistory />
    </div>
  );
};

export default OrderHistoryPage;