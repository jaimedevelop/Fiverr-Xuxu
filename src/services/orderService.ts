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
import { db } from '../firebase/config';
import { Order, OrderItem, OrderFilters, OrderStats, OrderStatus } from '../types/order';

class OrderService {
  private collectionName = 'orders';

  // Create a new order
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('🆕 OrderService.createOrder called with:', orderData);
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Order created in Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating order in Firebase:', error);
      throw new Error('No se pudo crear el pedido');
    }
  }

  // Get an order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    console.log('🔍 OrderService.getOrderById called with ID:', orderId);
    try {
      const docRef = doc(db, this.collectionName, orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('✅ Order found in Firebase:', data);
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || new Date(),
        } as Order;
      }
      console.log('❌ Order not found in Firebase for ID:', orderId);
      return null;
    } catch (error) {
      console.error('❌ Error getting order from Firebase:', error);
      throw new Error('No se pudo obtener el pedido');
    }
  }

  // Get orders for a business with optional filters
  async getOrdersByBusiness(businessId: string, filters?: OrderFilters): Promise<Order[]> {
    console.log('📋 OrderService.getOrdersByBusiness called with:');
    console.log('- businessId:', businessId);
    console.log('- filters:', filters);
    
    try {
      console.log('🔍 Building Firestore query...');
      
      let q = query(
        collection(db, this.collectionName),
        where('businessId', '==', businessId),
        orderBy('createdAt', 'desc')
      );

      console.log('✅ Base query created with businessId filter');

      // Apply filters
      if (filters?.status) {
        console.log('🔍 Adding status filter:', filters.status);
        q = query(q, where('status', '==', filters.status));
      }

      if (filters?.dateFrom) {
        console.log('🔍 Adding dateFrom filter:', filters.dateFrom);
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(filters.dateFrom)));
      }

      if (filters?.dateTo) {
        console.log('🔍 Adding dateTo filter:', filters.dateTo);
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(filters.dateTo)));
      }

      if (filters?.userId) {
        console.log('🔍 Adding userId filter:', filters.userId);
        q = query(q, where('userId', '==', filters.userId));
      }

      console.log('🚀 Executing Firestore query...');
      const querySnapshot = await getDocs(q);
      console.log('📊 Query executed. Documents found:', querySnapshot.size);
      
      const orders: Order[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        console.log('📄 Processing document:', doc.id);
        console.log('📄 Document data:', data);
        console.log('📄 Document businessId:', data.businessId);
        console.log('📄 Requested businessId:', businessId);
        console.log('📄 BusinessId match:', data.businessId === businessId);
        
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || new Date(),
        } as Order);
      });

      console.log('✅ Orders processed from Firebase:', orders.length);
      console.log('✅ Orders array:', orders);

      // Apply search filter if provided (client-side filtering)
      if (filters?.search) {
        console.log('🔍 Applying search filter:', filters.search);
        const searchLower = filters.search.toLowerCase();
        const filteredOrders = orders.filter(order => 
          order.id.toLowerCase().includes(searchLower) ||
          order.items.some(item => item.name.toLowerCase().includes(searchLower))
        );
        console.log('🔍 Orders after search filter:', filteredOrders.length);
        return filteredOrders;
      }

      console.log('🏁 Returning orders:', orders.length);
      return orders;
    } catch (error) {
      console.error('❌ Error getting orders from Firebase:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw new Error('No se pudieron obtener los pedidos');
    }
  }

  // Get orders for a user
  async getOrdersByUser(userId: string): Promise<Order[]> {
    console.log('👤 OrderService.getOrdersByUser called with userId:', userId);
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      console.log('🚀 Executing user orders query...');
      const querySnapshot = await getDocs(q);
      console.log('📊 User orders query executed. Documents found:', querySnapshot.size);
      
      const orders: Order[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        console.log('👤 User order document:', doc.id, data);
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || new Date(),
        } as Order);
      });

      console.log('✅ User orders processed:', orders.length);
      return orders;
    } catch (error) {
      console.error('❌ Error getting user orders:', error);
      throw new Error('No se pudieron obtener los pedidos del usuario');
    }
  }

  // Update an order
  async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    console.log('📝 OrderService.updateOrder called:', orderId, updates);
    try {
      const docRef = doc(db, this.collectionName, orderId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Order updated in Firebase');
    } catch (error) {
      console.error('❌ Error updating order:', error);
      throw new Error('No se pudo actualizar el pedido');
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    console.log('🔄 OrderService.updateOrderStatus called:', orderId, status);
    try {
      const docRef = doc(db, this.collectionName, orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Order status updated in Firebase');
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw new Error('No se pudo actualizar el estado del pedido');
    }
  }

  // Delete an order
  async deleteOrder(orderId: string): Promise<void> {
    console.log('🗑️ OrderService.deleteOrder called:', orderId);
    try {
      await deleteDoc(doc(db, this.collectionName, orderId));
      console.log('✅ Order deleted from Firebase');
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      throw new Error('No se pudo eliminar el pedido');
    }
  }

  // Get recent orders for a business
  async getRecentOrders(businessId: string, count: number = 5): Promise<Order[]> {
    console.log('⏰ OrderService.getRecentOrders called:', businessId, count);
    try {
      const q = query(
        collection(db, this.collectionName),
        where('businessId', '==', businessId),
        orderBy('createdAt', 'desc'),
        limit(count)
      );

      console.log('🚀 Executing recent orders query...');
      const querySnapshot = await getDocs(q);
      console.log('📊 Recent orders query executed. Documents found:', querySnapshot.size);
      
      const orders: Order[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        console.log('⏰ Recent order document:', doc.id, data);
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || new Date(),
        } as Order);
      });

      console.log('✅ Recent orders processed:', orders.length);
      return orders;
    } catch (error) {
      console.error('❌ Error getting recent orders:', error);
      throw new Error('No se pudieron obtener los pedidos recientes');
    }
  }

  // Get order statistics for a business
  async getOrderStats(businessId: string): Promise<OrderStats> {
    console.log('📊 OrderService.getOrderStats called for businessId:', businessId);
    try {
      const q = query(
        collection(db, this.collectionName),
        where('businessId', '==', businessId)
      );

      console.log('🚀 Executing stats query...');
      const querySnapshot = await getDocs(q);
      console.log('📊 Stats query executed. Documents found:', querySnapshot.size);
      
      const orders: Order[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        console.log('📊 Stats order document:', doc.id, data);
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

      const stats = {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
      };

      console.log('📊 Calculated stats:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error getting order stats:', error);
      throw new Error('No se pudieron obtener las estadísticas de pedidos');
    }
  }
}

export default new OrderService();