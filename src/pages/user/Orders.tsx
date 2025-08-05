import React from 'react';
import UserOrdersComponent from '../../components/user/orders/UserOrders';

const Orders: React.FC = () => {
  return (
    <div className="p-6">
      <UserOrdersComponent />
    </div>
  );
};

export default Orders;