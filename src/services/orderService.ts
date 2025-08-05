import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { Order, OrderItem, OrderFilters, OrderStats, OrderStatus } from '../types/order';

class OrderService {
  private collectionName = 'orders';

  // Create a new order
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('No se pudo crear el pedido');
    }
  }

  // Get an order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, this.collectionName, orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || new Date(),
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      throw new Error('No se pudo obtener el pedido');
    }
  }

  // Get orders for a business with optional filters
  async getOrdersByBusiness(businessId: string, filters?: OrderFilters): Promise<Order[]> {
    try {
      let q = query(
        collection(db, this.collectionName),
        where('businessId', '==', businessId),
        orderBy('createdAt', 'desc')
      );

      // Apply filters
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters?.dateFrom) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(filters.dateFrom)));
      }

      if (filters?.dateTo) {
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(filters.dateTo)));
      }

      if (filters?.userId) {
        q = query(q, where('userId', '==', filters.userId));
      }

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || new Date(),
        } as Order);
      });

      // Apply search filter if provided (client-side filtering)
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        return orders.filter(order => 
          order.id.toLowerCase().includes(searchLower) ||
          order.items.some(item => item.name.toLowerCase().includes(searchLower))
        );
      }

      return orders;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw new Error('No se pudieron obtener los pedidos');
    }
  }

  // Get orders for a user
  async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || new Date(),
        } as Order);
      });

      return orders;
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw new Error('No se pudieron obtener los pedidos del usuario');
    }
  }

  // Update an order
  async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, orderId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error('No se pudo actualizar el pedido');
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('No se pudo actualizar el estado del pedido');
    }
  }

  // Delete an order
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error('No se pudo eliminar el pedido');
    }
  }

  // Get recent orders for a business
  async getRecentOrders(businessId: string, count: number = 5): Promise<Order[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('businessId', '==', businessId),
        orderBy('createdAt', 'desc'),
        limit(count)
      );

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || new Date(),
        } as Order);
      });

      return orders;
    } catch (error) {
      console.error('Error getting recent orders:', error);
      throw new Error('No se pudieron obtener los pedidos recientes');
    }
  }

  // Get order statistics for a business
  async getOrderStats(businessId: string): Promise<OrderStats> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('businessId', '==', businessId)
      );

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || new Date(),
        } as Order);
      });

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'delivered').length;
      const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
      };
    } catch (error) {
      console.error('Error getting order stats:', error);
      throw new Error('No se pudieron obtener las estadísticas de pedidos');
    }
  }
}

export default new OrderService();