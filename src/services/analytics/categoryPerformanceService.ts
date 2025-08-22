// src/services/analytics/categoryPerformanceService.ts
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Order, OrderItem } from '../../types/order';
import { CategoryPerformance } from '../../types/analytics';

export const getCategoryPerformanceData = async (
  businessId: string,
  startDate: Date,
  endDate: Date
): Promise<CategoryPerformance[]> => {
  try {
    console.log('getCategoryPerformanceData called with:', {
      businessId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
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

    // Fetch all categories
    console.log('Fetching categories...');
    const categoriesQuery = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesQuery);
    
    const categoriesMap: Record<string, string> = {};
    categoriesSnapshot.forEach((doc) => {
      const data = doc.data();
      categoriesMap[doc.id] = data.name;
    });
    
    console.log('Categories fetched:', Object.keys(categoriesMap).length);

    // Fetch all pastries to map them to categories
    console.log('Fetching pastries...');
    const pastriesQuery = query(
      collection(db, 'pastries'),
      where('businessId', '==', businessId)
    );
    const pastriesSnapshot = await getDocs(pastriesQuery);
    
    const pastryCategories: Record<string, string> = {};
    pastriesSnapshot.forEach((doc) => {
      const data = doc.data();
      pastryCategories[doc.id] = data.categoryId;
    });
    
    console.log('Pastries fetched:', Object.keys(pastryCategories).length);

    // Initialize category performance
    const categoryPerformance: Record<string, CategoryPerformance> = {};
    Object.entries(categoriesMap).forEach(([categoryId, categoryName]) => {
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

    console.log('Total revenue calculated:', totalRevenue);

    // Calculate percentage of total
    Object.values(categoryPerformance).forEach(cp => {
      cp.percentageOfTotal = totalRevenue > 0 ? (cp.revenue / totalRevenue) * 100 : 0;
    });

    const result = Object.values(categoryPerformance).sort((a, b) => b.revenue - a.revenue);
    console.log('Final category performance data:', result);

    return result;
  } catch (error) {
    console.error('Error in getCategoryPerformanceData:', error);
    throw new Error('No se pudieron obtener los datos de rendimiento de categorías');
  }
};