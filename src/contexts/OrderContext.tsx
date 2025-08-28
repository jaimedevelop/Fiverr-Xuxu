// src/contexts/OrderContext.tsx - Simplified without pre-order scheduling
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import orderService from '../services/orderService';
import { Order, OrderFilters, OrderStats, FulfillmentType } from '../types/order';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  stats: OrderStats | null;
  fetchOrders: (filters?: OrderFilters) => Promise<void>;
  createOrder: (orderData: any) => Promise<string>;
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  setCurrentOrder: (order: Order | null) => void;
  refreshStats: () => Promise<void>;
  getOrdersByFulfillmentType: (fulfillmentType: FulfillmentType) => Order[];
  getPickupOrdersForDate: (date: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const { authState } = useAuth();
  const { user } = useUser();

  // Fetch orders for the current business - MEMOIZED to prevent infinite loop
  const fetchOrders = useCallback(async (filters?: OrderFilters) => {
    console.log('📋 fetchOrders called with filters:', filters);
    console.log('📋 Current user when fetching:', user);
    console.log('📋 User businessId:', user?.businessId);
    
    if (!user?.businessId) {
      console.log('❌ No businessId found, aborting fetch');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Calling orderService.getOrdersByBusiness with businessId:', user.businessId);
      
      const ordersData = await orderService.getOrdersByBusiness(user.businessId, filters);
      
      console.log('✅ Orders received from service:', ordersData);
      console.log('✅ Number of orders:', ordersData.length);
      
      setOrders(ordersData);
      
      if (ordersData.length === 0) {
        console.log('⚠️ No orders found for businessId:', user.businessId);
      }
    } catch (err: any) {
      console.error('❌ Error in fetchOrders:', err);
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, [user?.businessId]);

  // Create a new order
  const createOrder = useCallback(async (orderData: any): Promise<string> => {
    console.log('🆕 Creating new order with data:', orderData);
    setLoading(true);
    setError(null);
    
    try {
      const completeOrderData = {
        ...orderData,
        fulfillmentType: orderData.fulfillmentType || 'delivery',
        createdAt: new Date(),
        orderPlacedAt: new Date(),
        status: 'pending'
      };

      const orderId = await orderService.createOrder(completeOrderData);
      console.log('✅ Order created with ID:', orderId);
      
      await fetchOrders(); // Refresh the orders list
      return orderId;
    } catch (err: any) {
      console.error('❌ Error creating order:', err);
      setError(err.message || 'Error al crear el pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  // Update an order
  const updateOrder = useCallback(async (orderId: string, updates: Partial<Order>) => {
    console.log('📝 Updating order:', orderId, 'with updates:', updates);
    setLoading(true);
    setError(null);
    
    try {
      await orderService.updateOrder(orderId, updates);
      await fetchOrders(); // Refresh the orders list
      
      // Update current order if it's the one being updated
      if (currentOrder && currentOrder.id === orderId) {
        const updatedOrder = await orderService.getOrderById(orderId);
        setCurrentOrder(updatedOrder);
      }
      
      console.log('✅ Order updated successfully');
    } catch (err: any) {
      console.error('❌ Error updating order:', err);
      setError(err.message || 'Error al actualizar el pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOrders, currentOrder]);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    console.log('🔄 Updating order status:', orderId, 'to:', status);
    setLoading(true);
    setError(null);
    
    try {
      const updates: any = {
        status,
        updatedAt: new Date()
      };

      // Add timestamps for specific status changes
      if (status === 'preparing') {
        updates.preparationStartedAt = new Date();
      } else if (status === 'ready') {
        updates.readyAt = new Date();
      } else if (status === 'delivered') {
        updates.deliveredAt = new Date();
      } else if (status === 'cancelled') {
        updates.cancelledAt = new Date();
      }

      await orderService.updateOrder(orderId, updates);
      await fetchOrders(); // Refresh the orders list
      
      // Update current order if it's the one being updated
      if (currentOrder && currentOrder.id === orderId) {
        const updatedOrder = await orderService.getOrderById(orderId);
        setCurrentOrder(updatedOrder);
      }
      
      console.log('✅ Order status updated successfully');
    } catch (err: any) {
      console.error('❌ Error updating order status:', err);
      setError(err.message || 'Error al actualizar el estado del pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOrders, currentOrder]);

  // Delete an order
  const deleteOrder = useCallback(async (orderId: string) => {
    console.log('🗑️ Deleting order:', orderId);
    setLoading(true);
    setError(null);
    
    try {
      await orderService.deleteOrder(orderId);
      await fetchOrders(); // Refresh the orders list
      
      // Clear current order if it's the one being deleted
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder(null);
      }
      
      console.log('✅ Order deleted successfully');
    } catch (err: any) {
      console.error('❌ Error deleting order:', err);
      setError(err.message || 'Error al eliminar el pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOrders, currentOrder]);

  // Get order by ID
  const getOrderById = useCallback(async (orderId: string): Promise<Order | null> => {
    console.log('🔍 Getting order by ID:', orderId);
    setLoading(true);
    setError(null);
    
    try {
      const order = await orderService.getOrderById(orderId);
      console.log('✅ Order found:', order);
      return order;
    } catch (err: any) {
      console.error('❌ Error getting order by ID:', err);
      setError(err.message || 'Error al obtener el pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Set current order
  const handleSetCurrentOrder = useCallback((order: Order | null) => {
    console.log('📌 Setting current order:', order?.id);
    setCurrentOrder(order);
  }, []);

  // Get orders by fulfillment type
  const getOrdersByFulfillmentType = useCallback((fulfillmentType: FulfillmentType): Order[] => {
    const filtered = orders.filter(order => order.fulfillmentType === fulfillmentType);
    console.log(`🔍 Orders with fulfillmentType '${fulfillmentType}':`, filtered.length);
    return filtered;
  }, [orders]);

  // Get pickup orders for a specific date
  const getPickupOrdersForDate = useCallback((date: string): Order[] => {
    const filtered = orders.filter(order => {
      if (order.fulfillmentType !== 'pickup' || !order.pickupTime) return false;
      
      const orderDate = order.pickupTime.date;
      return orderDate === date;
    });
    console.log(`🔍 Pickup orders for date '${date}':`, filtered.length);
    return filtered;
  }, [orders]);

  // Refresh order statistics
  const refreshStats = useCallback(async () => {
    console.log('📊 Refreshing order stats for businessId:', user?.businessId);
    if (!user?.businessId) return;
    
    try {
      const statsData = await orderService.getOrderStats(user.businessId);
      
      // Calculate additional stats
      const deliveryOrders = orders.filter(order => order.fulfillmentType === 'delivery').length;
      const pickupOrders = orders.filter(order => order.fulfillmentType === 'pickup').length;
      
      const enhancedStats = {
        ...statsData,
        deliveryOrders,
        pickupOrders
      };
      
      console.log('📊 Enhanced stats calculated:', enhancedStats);
      setStats(enhancedStats);
    } catch (err: any) {
      console.error('❌ Error refreshing order stats:', err);
      // Don't set error here as it's not critical
    }
  }, [user?.businessId, orders]);

  // Load orders and stats when business ID changes - ONLY ONCE
  useEffect(() => {
    console.log('🔄 useEffect triggered - user?.businessId changed:', user?.businessId);
    
    if (user?.businessId) {
      console.log('✅ BusinessId found, fetching orders');
      fetchOrders();
    } else {
      console.log('❌ No businessId found, skipping fetch');
    }
  }, [user?.businessId, fetchOrders]);

  // Recalculate stats when orders change
  useEffect(() => {
    if (orders.length > 0 && user?.businessId) {
      console.log('🔄 Orders changed, recalculating stats. Orders count:', orders.length);
      refreshStats();
    }
  }, [orders, refreshStats, user?.businessId]);

  const value = {
    orders,
    currentOrder,
    loading,
    error,
    stats,
    fetchOrders,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderById,
    setCurrentOrder: handleSetCurrentOrder,
    refreshStats,
    getOrdersByFulfillmentType,
    getPickupOrdersForDate,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};