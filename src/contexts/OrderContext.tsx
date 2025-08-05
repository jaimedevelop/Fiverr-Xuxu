import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import orderService from '../services/orderService';
import { Order, OrderFilters, OrderStats } from '../types/order';
import { useAuth } from './AuthContext';

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
  const { user } = authState;

  // Fetch orders for the current business
  const fetchOrders = async (filters?: OrderFilters) => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const ordersData = await orderService.getOrdersByBusiness(user.businessId, filters);
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pedidos');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new order
  const createOrder = async (orderData: any): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const orderId = await orderService.createOrder(orderData);
      await fetchOrders(); // Refresh the orders list
      await refreshStats(); // Refresh stats
      return orderId;
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido');
      console.error('Error creating order:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an order
  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
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
      
      await refreshStats(); // Refresh stats
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el pedido');
      console.error('Error updating order:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, status: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await orderService.updateOrderStatus(orderId, status as any);
      await fetchOrders(); // Refresh the orders list
      
      // Update current order if it's the one being updated
      if (currentOrder && currentOrder.id === orderId) {
        const updatedOrder = await orderService.getOrderById(orderId);
        setCurrentOrder(updatedOrder);
      }
      
      await refreshStats(); // Refresh stats
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado del pedido');
      console.error('Error updating order status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an order
  const deleteOrder = async (orderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await orderService.deleteOrder(orderId);
      await fetchOrders(); // Refresh the orders list
      
      // Clear current order if it's the one being deleted
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder(null);
      }
      
      await refreshStats(); // Refresh stats
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el pedido');
      console.error('Error deleting order:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID
  const getOrderById = async (orderId: string): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const order = await orderService.getOrderById(orderId);
      return order;
    } catch (err: any) {
      setError(err.message || 'Error al obtener el pedido');
      console.error('Error getting order by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set current order
  const handleSetCurrentOrder = (order: Order | null) => {
    setCurrentOrder(order);
  };

  // Refresh order statistics
  const refreshStats = async () => {
    if (!user?.businessId) return;
    
    try {
      const statsData = await orderService.getOrderStats(user.businessId);
      setStats(statsData);
    } catch (err: any) {
      console.error('Error refreshing order stats:', err);
      // Don't set error here as it's not critical
    }
  };

  // Load orders and stats when business ID changes
  useEffect(() => {
    if (user?.businessId) {
      fetchOrders();
      refreshStats();
    }
  }, [user?.businessId]);

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
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};