// src/services/analytics/topItemsService.ts
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Order, OrderItem } from '../../types/order';
import { ItemPerformance } from '../../types/analytics';

export const getTopItemsData = async (
  businessId: string,
  startDate: Date,
  endDate: Date
): Promise<ItemPerformance[]> => {
  try {
    // Fetch orders within the specified time range
    const ordersQuery = query(
      collection(db, 'orders'),
      where('businessId', '==', businessId),
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      where('createdAt', '<=', Timestamp.fromDate(endDate))
    );
    
    const querySnapshot = await getDocs(ordersQuery);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || new Date(),
      } as Order);
    });

    // Aggregate item data
    const itemMap: Record<string, ItemPerformance> = {};
    
    orders.forEach(order => {
      order.items.forEach((item: OrderItem) => {
        if (!itemMap[item.pastryId]) {
          itemMap[item.pastryId] = {
            pastryId: item.pastryId,
            name: item.name,
            categoryId: 'unknown',
            categoryName: 'Sin categoría',
            ordersCount: 0,
            totalQuantity: 0,
            revenue: 0,
            popularityScore: 0,
          };
        }
        
        itemMap[item.pastryId].ordersCount += 1;
        itemMap[item.pastryId].totalQuantity += item.quantity;
        itemMap[item.pastryId].revenue += item.price * item.quantity;
      });
    });

    // Calculate popularity score
    const maxRevenue = Math.max(...Object.values(itemMap).map(item => item.revenue), 1);
    
    const items = Object.values(itemMap).map(item => ({
      ...item,
      popularityScore: Math.round((item.revenue / maxRevenue) * 100)
    }));

    // Sort by revenue (descending)
    return items.sort((a, b) => b.revenue - a.revenue);
  } catch (error) {
    console.error('Error fetching top items:', error);
    throw new Error('No se pudieron obtener los datos de productos más vendidos');
  }
};