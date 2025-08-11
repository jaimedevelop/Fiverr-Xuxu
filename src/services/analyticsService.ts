import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  startAt,
  endAt,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  AnalyticsData, 
  SalesDataPoint, 
  TimeRange, 
  DateRange, 
  ItemPerformance,
  CustomerAnalytics,
  SalesComparison,
  HourlySalesData,
  DailySalesData,
  CategoryPerformance
} from '../types/analytics';
import { Order } from '../types/order';

class AnalyticsService {
  private ordersCollection = 'orders';
  private pastriesCollection = 'pastries';
  private categoriesCollection = 'categories';
  private usersCollection = 'users';

  // Get analytics data for a business within a time range
  async getAnalyticsData(businessId: string, timeRange: TimeRange): Promise<AnalyticsData> {
    try {
      const orders = await this.getOrdersInTimeRange(businessId, timeRange);
      
      const totalOrders = orders.length;
      const revenue = orders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;
      
      // Get popular items
      const itemCounts: Record<string, number> = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          itemCounts[item.pastryId] = (itemCounts[item.pastryId] || 0) + item.quantity;
        });
      });
      
      const popularItems = Object.entries(itemCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([pastryId]) => pastryId);
      
      // Get customer data
      const customerIds = [...new Set(orders.map(order => order.userId))];
      const customerCount = customerIds.length;
      
      // Get new customers (those who placed their first order in this time range)
      const newCustomers = await this.getNewCustomersCount(businessId, customerIds, timeRange);
      
      return {
        businessId,
        date: new Date(),
        metrics: {
          totalOrders,
          revenue,
          averageOrderValue,
          popularItems,
          customerCount,
          newCustomers,
        },
      };
    } catch (error) {
      console.error('Error getting analytics data:', error);
      throw new Error('No se pudieron obtener los datos de análisis');
    }
  }

  // Get sales data over time
  async getSalesData(businessId: string, timeRange: TimeRange, groupBy: 'day' | 'hour' = 'day'): Promise<SalesDataPoint[]> {
    try {
      const orders = await this.getOrdersInTimeRange(businessId, timeRange);
      
      // Group orders by time period
      const groupedData: Record<string, { orders: number; revenue: number }> = {};
      
      orders.forEach(order => {
        const date = new Date(order.createdAt);
        let key: string;
        
        if (groupBy === 'hour') {
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
        } else {
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        }
        
        if (!groupedData[key]) {
          groupedData[key] = { orders: 0, revenue: 0 };
        }
        
        groupedData[key].orders += 1;
        groupedData[key].revenue += order.total;
      });
      
      // Convert to array and sort by date
      return Object.entries(groupedData).map(([key, data]) => {
        const [year, month, day, hour] = key.split('-').map(Number);
        const date = hour !== undefined 
          ? new Date(year, month, day, hour)
          : new Date(year, month, day);
          
        return {
          date,
          orders: data.orders,
          revenue: data.revenue,
        };
      }).sort((a, b) => a.date.getTime() - b.date.getTime());
    } catch (error) {
      console.error('Error getting sales data:', error);
      throw new Error('No se pudieron obtener los datos de ventas');
    }
  }

  // Get item performance data
  async getItemPerformance(businessId: string, timeRange: TimeRange): Promise<ItemPerformance[]> {
    try {
      const orders = await this.getOrdersInTimeRange(businessId, timeRange);
      
      // Get all pastries for the business
      const pastriesQuery = query(
        collection(db, this.pastriesCollection),
        where('businessId', '==', businessId)
      );
      const pastriesSnapshot = await getDocs(pastriesQuery);
      
      // Get all categories
      const categoriesSnapshot = await getDocs(collection(db, this.categoriesCollection));
      const categoriesMap: Record<string, string> = {};
      categoriesSnapshot.forEach((doc: QueryDocumentSnapshot) => {
        categoriesMap[doc.id] = doc.data().name;
      });
      
      // Initialize performance data for each pastry
      const performanceMap: Record<string, ItemPerformance> = {};
      
      pastriesSnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const pastry = doc.data();
        performanceMap[doc.id] = {
          pastryId: doc.id,
          name: pastry.name,
          categoryId: pastry.categoryId,
          categoryName: categoriesMap[pastry.categoryId] || 'Sin Categoría',
          ordersCount: 0,
          totalQuantity: 0,
          revenue: 0,
          popularityScore: 0,
        };
      });
      
      // Calculate performance from orders
      orders.forEach(order => {
        order.items.forEach(item => {
          if (performanceMap[item.pastryId]) {
            performanceMap[item.pastryId].ordersCount += 1;
            performanceMap[item.pastryId].totalQuantity += item.quantity;
            performanceMap[item.pastryId].revenue += item.price * item.quantity;
          }
        });
      });
      
      // Calculate popularity score (normalized 0-100)
      const maxRevenue = Math.max(...Object.values(performanceMap).map(p => p.revenue), 1);
      Object.values(performanceMap).forEach(p => {
        p.popularityScore = Math.round((p.revenue / maxRevenue) * 100);
      });
      
      return Object.values(performanceMap).sort((a, b) => b.revenue - a.revenue);
    } catch (error) {
      console.error('Error getting item performance:', error);
      throw new Error('No se pudo obtener el rendimiento de los items');
    }
  }

  // Get customer analytics
  async getCustomerAnalytics(businessId: string, timeRange: TimeRange): Promise<CustomerAnalytics> {
    try {
      const orders = await this.getOrdersInTimeRange(businessId, timeRange);
      
      // Get all customer IDs
      const customerIds = [...new Set(orders.map(order => order.userId))];
      const totalCustomers = customerIds.length;
      
      // Calculate orders per customer
      const customerOrders: Record<string, number> = {};
      const customerSpending: Record<string, number> = {};
      
      orders.forEach(order => {
        customerOrders[order.userId] = (customerOrders[order.userId] || 0) + 1;
        customerSpending[order.userId] = (customerSpending[order.userId] || 0) + order.total;
      });
      
      const averageOrdersPerCustomer = totalCustomers > 0 
        ? orders.length / totalCustomers 
        : 0;
      
      // Get top customers
      const topCustomers = Object.entries(customerSpending)
        .map(([userId, totalSpent]) => ({
          userId,
          name: `Cliente ${userId.slice(0, 6)}`, // In a real app, you would get the actual name
          ordersCount: customerOrders[userId],
          totalSpent,
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);
      
      // Get new customers (simplified - in a real app, you would check first order date)
      const newCustomers = Math.floor(totalCustomers * 0.3); // 30% are new customers
      const returningCustomers = totalCustomers - newCustomers;
      
      return {
        totalCustomers,
        newCustomers,
        returningCustomers,
        averageOrdersPerCustomer,
        topCustomers,
      };
    } catch (error) {
      console.error('Error getting customer analytics:', error);
      throw new Error('No se pudieron obtener los análisis de clientes');
    }
  }

  // Get sales comparison between two periods
  async getSalesComparison(businessId: string, currentRange: TimeRange, previousRange: TimeRange): Promise<SalesComparison> {
    try {
      const currentOrders = await this.getOrdersInTimeRange(businessId, currentRange);
      const previousOrders = await this.getOrdersInTimeRange(businessId, previousRange);
      
      // Calculate current period metrics
      const currentRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0);
      const currentOrdersCount = currentOrders.length;
      const currentAOV = currentOrdersCount > 0 ? currentRevenue / currentOrdersCount : 0;
      
      // Calculate previous period metrics
      const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
      const previousOrdersCount = previousOrders.length;
      const previousAOV = previousOrdersCount > 0 ? previousRevenue / previousOrdersCount : 0;
      
      // Calculate percentage changes
      const revenueChange = previousRevenue > 0 
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;
      
      const ordersChange = previousOrdersCount > 0 
        ? ((currentOrdersCount - previousOrdersCount) / previousOrdersCount) * 100 
        : 0;
      
      const aovChange = previousAOV > 0 
        ? ((currentAOV - previousAOV) / previousAOV) * 100 
        : 0;
      
      return {
        currentPeriod: {
          revenue: currentRevenue,
          orders: currentOrdersCount,
          averageOrderValue: currentAOV,
        },
        previousPeriod: {
          revenue: previousRevenue,
          orders: previousOrdersCount,
          averageOrderValue: previousAOV,
        },
        revenueChange,
        ordersChange,
        aovChange,
      };
    } catch (error) {
      console.error('Error getting sales comparison:', error);
      throw new Error('No se pudo obtener la comparación de ventas');
    }
  }

  // Get hourly sales data
  async getHourlySalesData(businessId: string, date: Date): Promise<HourlySalesData[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const orders = await this.getOrdersInTimeRange(businessId, { start: startOfDay, end: endOfDay });
      
      // Initialize hourly data
      const hourlyData: HourlySalesData[] = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        orders: 0,
        revenue: 0,
      }));
      
      // Aggregate orders by hour
      orders.forEach(order => {
        const hour = new Date(order.createdAt).getHours();
        hourlyData[hour].orders += 1;
        hourlyData[hour].revenue += order.total;
      });
      
      return hourlyData;
    } catch (error) {
      console.error('Error getting hourly sales data:', error);
      throw new Error('No se pudieron obtener los datos de ventas por hora');
    }
  }

  // Get daily sales data for a week
  async getDailySalesData(businessId: string, weekStart: Date): Promise<DailySalesData[]> {
    try {
      const startOfWeek = new Date(weekStart);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      const orders = await this.getOrdersInTimeRange(businessId, { start: startOfWeek, end: endOfWeek });
      
      // Initialize daily data
      const dailyData: DailySalesData[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        return {
          date,
          dayOfWeek: date.getDay(),
          orders: 0,
          revenue: 0,
        };
      });
      
      // Aggregate orders by day
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const dayIndex = Math.floor((orderDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < 7) {
          dailyData[dayIndex].orders += 1;
          dailyData[dayIndex].revenue += order.total;
        }
      });
      
      return dailyData;
    } catch (error) {
      console.error('Error getting daily sales data:', error);
      throw new Error('No se pudieron obtener los datos de ventas diarios');
    }
  }

  // Get category performance
  async getCategoryPerformance(businessId: string, timeRange: TimeRange): Promise<CategoryPerformance[]> {
    try {
      const orders = await this.getOrdersInTimeRange(businessId, timeRange);
      
      // Get all categories
      const categoriesSnapshot = await getDocs(collection(db, this.categoriesCollection));
      const categories: Record<string, string> = {};
      categoriesSnapshot.forEach((doc: QueryDocumentSnapshot) => {
        categories[doc.id] = doc.data().name;
      });
      
      // Get all pastries with their categories
      const pastriesQuery = query(
        collection(db, this.pastriesCollection),
        where('businessId', '==', businessId)
      );
      const pastriesSnapshot = await getDocs(pastriesQuery);
      const pastryCategories: Record<string, string> = {};
      pastriesSnapshot.forEach((doc: QueryDocumentSnapshot) => {
        pastryCategories[doc.id] = doc.data().categoryId;
      });
      
      // Initialize category performance
      const categoryPerformance: Record<string, CategoryPerformance> = {};
      Object.values(categories).forEach(categoryName => {
        // Find category ID by name (simplified approach)
        const categoryId = Object.entries(categories).find(([_, name]) => name === categoryName)?.[0] || '';
        categoryPerformance[categoryId] = {
          categoryId,
          categoryName,
          ordersCount: 0,
          revenue: 0,
          percentageOfTotal: 0,
        };
      });
      
      // Calculate performance from orders
      let totalRevenue = 0;
      orders.forEach(order => {
        order.items.forEach(item => {
          const categoryId = pastryCategories[item.pastryId];
          if (categoryId && categoryPerformance[categoryId]) {
            categoryPerformance[categoryId].ordersCount += 1;
            categoryPerformance[categoryId].revenue += item.price * item.quantity;
            totalRevenue += item.price * item.quantity;
          }
        });
      });
      
      // Calculate percentage of total
      Object.values(categoryPerformance).forEach(cp => {
        cp.percentageOfTotal = totalRevenue > 0 ? (cp.revenue / totalRevenue) * 100 : 0;
      });
      
      return Object.values(categoryPerformance).sort((a, b) => b.revenue - a.revenue);
    } catch (error) {
      console.error('Error getting category performance:', error);
      throw new Error('No se pudo obtener el rendimiento de las categorías');
    }
  }

  // Helper method to get orders in a time range
  private async getOrdersInTimeRange(businessId: string, timeRange: TimeRange): Promise<Order[]> {
    try {
      const q = query(
        collection(db, this.ordersCollection),
        where('businessId', '==', businessId),
        where('createdAt', '>=', Timestamp.fromDate(timeRange.start)),
        where('createdAt', '<=', Timestamp.fromDate(timeRange.end)),
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
      console.error('Error getting orders in time range:', error);
      throw new Error('No se pudieron obtener los pedidos en el rango de tiempo');
    }
  }

  // Helper method to count new customers
  private async getNewCustomersCount(businessId: string, customerIds: string[], timeRange: TimeRange): Promise<number> {
    try {
      // This is a simplified approach - in a real app, you would check first order date
      // For now, we'll assume 30% of customers are new
      return Math.floor(customerIds.length * 0.3);
    } catch (error) {
      console.error('Error getting new customers count:', error);
      return 0;
    }
  }
}

export default new AnalyticsService();