// src/services/analytics/salesDataService.ts
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Order } from '../../types/order';
import { SalesDataPoint } from '../../types/analytics';

export const getSalesData = async (
  businessId: string,
  startDate: Date,
  endDate: Date,
  groupBy: 'day' | 'hour' = 'day'
): Promise<SalesDataPoint[]> => {
  try {
    console.log('getSalesData called with:', {
      businessId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      groupBy
    });

    // Fetch orders within the specified time range
    console.log('Creating Firestore query for orders...');
    const ordersQuery = query(
      collection(db, 'orders'),
      where('businessId', '==', businessId),
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      where('createdAt', '<=', Timestamp.fromDate(endDate))
    );
    
    console.log('Executing orders query...');
    const ordersQuerySnapshot = await getDocs(ordersQuery);
    console.log('Orders query executed. Documents found:', ordersQuerySnapshot.size);
    
    const orders: Order[] = [];
    
    ordersQuerySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || new Date(),
      } as Order);
    });

    console.log('Orders processed:', orders.length);

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
    
    console.log('Grouped data created with keys:', Object.keys(groupedData).length);

    // Convert to array and sort by date
    const result = Object.entries(groupedData).map(([key, data]) => {
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
    
    console.log('Final sales data:', result);
    
    return result;
  } catch (error) {
    console.error('Error in getSalesData:', error);
    throw new Error('No se pudieron obtener los datos de ventas');
  }
};