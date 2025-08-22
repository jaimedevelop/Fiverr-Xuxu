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
  console.log('getTopItemsData called with:', {
    businessId,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  });

  try {
    // Fetch orders within the specified time range
    console.log('Creating Firestore query...');
    const ordersQuery = query(
      collection(db, 'orders'),
      where('businessId', '==', businessId),
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      where('createdAt', '<=', Timestamp.fromDate(endDate))
    );
    
    console.log('Executing query...');
    const querySnapshot = await getDocs(ordersQuery);
    console.log('Query executed. Documents found:', querySnapshot.size);
    
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      console.log('Processing document:', doc.id);
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

    // Aggregate item data
    const itemMap: Record<string, ItemPerformance> = {};
    
    orders.forEach(order => {
      console.log('Processing order:', order.id, 'with items:', order.items.length);
      order.items.forEach((item: OrderItem) => {
        if (!itemMap[item.pastryId]) {
          console.log('Creating new item entry for:', item.pastryId);
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

    console.log('Item map created with entries:', Object.keys(itemMap).length);

    // Calculate popularity score
    const maxRevenue = Math.max(...Object.values(itemMap).map(item => item.revenue), 1);
    console.log('Max revenue calculated:', maxRevenue);
    
    const items = Object.values(itemMap).map(item => ({
      ...item,
      popularityScore: Math.round((item.revenue / maxRevenue) * 100)
    }));

    console.log('Items with popularity scores:', items);

    // Sort by revenue (descending)
    const sortedItems = items.sort((a, b) => b.revenue - a.revenue);
    console.log('Final sorted items:', sortedItems);

    return sortedItems;
  } catch (error) {
    console.error('Error in getTopItemsData:', error);
    throw new Error('No se pudieron obtener los datos de productos más vendidos');
  }
};