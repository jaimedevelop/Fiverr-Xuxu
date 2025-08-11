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
import { 
  InventoryItem, 
  StockChange, 
  InventoryWithDetails, 
  StockAlert, 
  InventoryForecast,
  InventoryStats 
} from '../types/inventory';

class InventoryService {
  private collectionName = 'inventory';
  private stockAlertsCollection = 'stockAlerts';

  // Create a new inventory item
  async createInventoryItem(itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...itemData,
        lastUpdated: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw new Error('No se pudo crear el item de inventario');
    }
  }

  // Get an inventory item by ID
  async getInventoryItemById(itemId: string): Promise<InventoryItem | null> {
    try {
      const docRef = doc(db, this.collectionName, itemId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          lastUpdated: data.lastUpdated?.toDate() || new Date(),
        } as InventoryItem;
      }
      return null;
    } catch (error) {
      console.error('Error getting inventory item:', error);
      throw new Error('No se pudo obtener el item de inventario');
    }
  }

  // Get all inventory items for a business
  async getInventoryByBusiness(businessId: string): Promise<InventoryWithDetails[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('businessId', '==', businessId),
        orderBy('pastryName')
      );

      const querySnapshot = await getDocs(q);
      const inventoryItems: InventoryWithDetails[] = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const inventoryItem: InventoryItem = {
          id: doc.id,
          ...data,
          lastUpdated: data.lastUpdated?.toDate() || new Date(),
        } as InventoryItem;

        // Get pastry details
        const pastryDoc = await getDoc(doc(db, 'pastries', inventoryItem.pastryId));
        const pastryData = pastryDoc.exists() ? pastryDoc.data() : null;

        // Get category details
        let categoryName = 'Sin Categoría';
        if (pastryData && pastryData.categoryId) {
          const categoryDoc = await getDoc(doc(db, 'categories', pastryData.categoryId));
          if (categoryDoc.exists()) {
            categoryName = categoryDoc.data().name;
          }
        }

        inventoryItems.push({
          ...inventoryItem,
          pastryName: pastryData?.name || 'Producto desconocido',
          categoryName,
          unitPrice: pastryData?.price || 0,
          isLowStock: inventoryItem.currentStock <= inventoryItem.minimumStock,
        });
      }

      return inventoryItems;
    } catch (error) {
      console.error('Error getting inventory:', error);
      throw new Error('No se pudo obtener el inventario');
    }
  }

  // Update an inventory item
  async updateInventoryItem(itemId: string, updates: Partial<InventoryItem>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, itemId);
      await updateDoc(docRef, {
        ...updates,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw new Error('No se pudo actualizar el item de inventario');
    }
  }

  // Update stock quantity
  async updateStock(itemId: string, quantity: number, reason: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, itemId);
      const itemDoc = await getDoc(docRef);
      
      if (!itemDoc.exists()) {
        throw new Error('Item de inventario no encontrado');
      }

      const currentData = itemDoc.data();
      const currentStock = currentData.currentStock || 0;
      const newStock = currentStock + quantity;

      // Record stock change
      const changeType = quantity > 0 ? 'addition' : quantity < 0 ? 'subtraction' : 'adjustment';
      await this.recordStockChange(itemId, quantity, changeType, reason, userId);

      // Update stock
      await updateDoc(docRef, {
        currentStock: newStock,
        lastUpdated: serverTimestamp(),
      });

      // Check if we need to create or update a stock alert
      if (newStock <= currentData.minimumStock) {
        await this.createOrUpdateStockAlert(itemId, currentData.businessId, newStock, currentData.minimumStock);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      throw new Error('No se pudo actualizar el stock');
    }
  }

  // Record a stock change
  private async recordStockChange(
    itemId: string, 
    quantity: number, 
    type: 'addition' | 'subtraction' | 'adjustment', 
    reason: string, 
    userId: string
  ): Promise<void> {
    try {
      const stockChangeRef = collection(db, 'stockChanges');
      await addDoc(stockChangeRef, {
        itemId,
        quantity,
        type,
        reason,
        userId,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error recording stock change:', error);
      throw new Error('No se pudo registrar el cambio de stock');
    }
  }

  // Get stock history for an item
  async getStockHistory(itemId: string): Promise<StockChange[]> {
    try {
      const q = query(
        collection(db, 'stockChanges'),
        where('itemId', '==', itemId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const stockChanges: StockChange[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        stockChanges.push({
          date: data.timestamp?.toDate() || new Date(),
          quantity: data.quantity,
          type: data.type,
          reason: data.reason,
          userId: data.userId,
        });
      });

      return stockChanges;
    } catch (error) {
      console.error('Error getting stock history:', error);
      throw new Error('No se pudo obtener el historial de stock');
    }
  }

  // Create or update a stock alert
  private async createOrUpdateStockAlert(
    itemId: string, 
    businessId: string, 
    currentStock: number, 
    minimumStock: number
  ): Promise<void> {
    try {
      // Check if alert already exists
      const q = query(
        collection(db, this.stockAlertsCollection),
        where('itemId', '==', itemId),
        where('acknowledged', '==', false)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Get pastry name
        const pastryDoc = await getDoc(doc(db, 'pastries', itemId));
        const pastryName = pastryDoc.exists() ? pastryDoc.data().name : 'Producto desconocido';

        // Create new alert
        await addDoc(collection(db, this.stockAlertsCollection), {
          itemId,
          businessId,
          pastryName,
          currentStock,
          minimumStock,
          severity: currentStock === 0 ? 'critical' : 'low',
          createdAt: serverTimestamp(),
          acknowledged: false,
        });
      }
    } catch (error) {
      console.error('Error creating stock alert:', error);
      throw new Error('No se pudo crear la alerta de stock');
    }
  }

  // Get stock alerts for a business
  async getStockAlerts(businessId: string): Promise<StockAlert[]> {
    try {
      const q = query(
        collection(db, this.stockAlertsCollection),
        where('businessId', '==', businessId),
        where('acknowledged', '==', false),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const alerts: StockAlert[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        alerts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          acknowledgedAt: data.acknowledgedAt?.toDate(),
        } as StockAlert);
      });

      return alerts;
    } catch (error) {
      console.error('Error getting stock alerts:', error);
      throw new Error('No se pudieron obtener las alertas de stock');
    }
  }

  // Acknowledge a stock alert
  async acknowledgeStockAlert(alertId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, this.stockAlertsCollection, alertId);
      await updateDoc(docRef, {
        acknowledged: true,
        acknowledgedAt: serverTimestamp(),
        acknowledgedBy: userId,
      });
    } catch (error) {
      console.error('Error acknowledging stock alert:', error);
      throw new Error('No se pudo acknowledge la alerta de stock');
    }
  }

  // Get inventory statistics
  async getInventoryStats(businessId: string): Promise<InventoryStats> {
    try {
      const inventory = await this.getInventoryByBusiness(businessId);
      
      const totalItems = inventory.length;
      const lowStockItems = inventory.filter(item => item.isLowStock).length;
      const outOfStockItems = inventory.filter(item => item.currentStock === 0).length;
      const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

      // Get top selling items (this would typically be calculated from order data)
      const topSellingItems = await this.getTopSellingItems(businessId, 5);

      return {
        totalItems,
        lowStockItems,
        outOfStockItems,
        totalValue,
        topSellingItems,
      };
    } catch (error) {
      console.error('Error getting inventory stats:', error);
      throw new Error('No se pudieron obtener las estadísticas de inventario');
    }
  }

  // Get top selling items (simplified version)
  private async getTopSellingItems(businessId: string, limit: number): Promise<{pastryId: string; name: string; quantitySold: number}[]> {
    try {
      // This is a simplified version - in a real app, you would analyze order data
      const q = query(
        collection(db, 'pastries'),
        where('businessId', '==', businessId),
        orderBy('name'),
        limit(limit)
      );

      const querySnapshot = await getDocs(q);
      const items: {pastryId: string; name: string; quantitySold: number}[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        items.push({
          pastryId: doc.id,
          name: data.name,
          quantitySold: Math.floor(Math.random() * 100), // This would be calculated from actual order data
        });
      });

      return items.sort((a, b) => b.quantitySold - a.quantitySold);
    } catch (error) {
      console.error('Error getting top selling items:', error);
      return [];
    }
  }

  // Generate inventory forecast
  async generateInventoryForecast(businessId: string): Promise<InventoryForecast[]> {
    try {
      const inventory = await this.getInventoryByBusiness(businessId);
      const forecasts: InventoryForecast[] = [];

      for (const item of inventory) {
        // This is a simplified forecast - in a real app, you would analyze historical usage data
        const averageDailyUsage = Math.max(1, item.unitPrice / 10); // Simplified calculation
        const daysRemaining = item.currentStock / averageDailyUsage;
        const recommendedOrderDate = new Date();
        recommendedOrderDate.setDate(recommendedOrderDate.getDate() + Math.max(1, daysRemaining - 7));
        const recommendedOrderQuantity = Math.max(10, item.minimumStock * 2 - item.currentStock);

        forecasts.push({
          pastryId: item.pastryId,
          pastryName: item.pastryName,
          currentStock: item.currentStock,
          averageDailyUsage,
          daysRemaining,
          recommendedOrderDate,
          recommendedOrderQuantity,
        });
      }

      return forecasts.sort((a, b) => a.daysRemaining - b.daysRemaining);
    } catch (error) {
      console.error('Error generating inventory forecast:', error);
      throw new Error('No se pudo generar el pronóstico de inventario');
    }
  }
}

export default new InventoryService();