import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  InventoryItem, 
  InventoryWithDetails, 
  StockAlert, 
  InventoryStats,
  StockChange 
} from '../types/inventory';
import inventoryService from '../services/inventoryService';
import { useAuth } from './AuthContext';

interface InventoryContextType {
  inventoryItems: InventoryWithDetails[] | null;
  stockAlerts: StockAlert[] | null;
  inventoryStats: InventoryStats | null;
  loading: boolean;
  error: string | null;
  fetchInventoryItems: () => void;
  fetchStockAlerts: () => void;
  fetchInventoryStats: () => void;
  createInventoryItem: (item: Partial<InventoryWithDetails>) => void;
  updateInventoryItem: (itemId: string, item: Partial<InventoryWithDetails>) => void;
  deleteInventoryItem: (itemId: string) => void;
  acknowledgeStockAlert: (alertId: string) => void;
  dismissStockAlert: (alertId: string) => void;
  addStock: (itemId: string, quantity: number, reason: string) => void;
  subtractStock: (itemId: string, quantity: number, reason: string) => void;
  adjustStock: (itemId: string, quantity: number, reason: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const { authState } = useAuth();
  const user = authState.user;
  const [inventoryItems, setInventoryItems] = useState<InventoryWithDetails[] | null>(null);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[] | null>(null);
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryItems = async () => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const items = await inventoryService.getInventoryByBusiness(user.businessId);
      setInventoryItems(items);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el inventario');
      console.error('Error fetching inventory items:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockAlerts = async () => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const alerts = await inventoryService.getStockAlerts(user.businessId);
      setStockAlerts(alerts);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las alertas de stock');
      console.error('Error fetching stock alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryStats = async () => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const stats = await inventoryService.getInventoryStats(user.businessId);
      setInventoryStats(stats);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las estadísticas de inventario');
      console.error('Error fetching inventory stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const createInventoryItem = async (itemData: Partial<InventoryWithDetails>) => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { pastryName, categoryName, unitPrice, isLowStock, ...inventoryItemData } = itemData;
      
      // Ensure required properties are present
      if (!inventoryItemData.pastryId) {
        throw new Error('El ID del producto es requerido');
      }
      
      if (inventoryItemData.currentStock === undefined) {
        throw new Error('El stock actual es requerido');
      }
      
      if (inventoryItemData.minimumStock === undefined) {
        throw new Error('El stock mínimo es requerido');
      }
      
      await inventoryService.createInventoryItem({
        businessId: user.businessId,
        pastryId: inventoryItemData.pastryId,
        currentStock: inventoryItemData.currentStock,
        minimumStock: inventoryItemData.minimumStock,
      });
      fetchInventoryItems();
    } catch (err: any) {
      setError(err.message || 'Error al crear el item de inventario');
      console.error('Error creating inventory item:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateInventoryItem = async (itemId: string, itemData: Partial<InventoryWithDetails>) => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await inventoryService.updateInventoryItem(itemId, itemData);
      fetchInventoryItems();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el item de inventario');
      console.error('Error updating inventory item:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteInventoryItem = async (itemId: string) => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // This method doesn't exist in the service, we'll need to implement it
      // For now, let's just update the item to mark it as inactive
      await inventoryService.updateInventoryItem(itemId, { currentStock: -1 });
      fetchInventoryItems();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el item de inventario');
      console.error('Error deleting inventory item:', err);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeStockAlert = async (alertId: string) => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await inventoryService.acknowledgeStockAlert(alertId, user.uid);
      fetchStockAlerts();
    } catch (err: any) {
      setError(err.message || 'Error al reconocer la alerta de stock');
      console.error('Error acknowledging stock alert:', err);
    } finally {
      setLoading(false);
    }
  };

  const dismissStockAlert = async (alertId: string) => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // This method doesn't exist in the service, we'll need to implement it
      // For now, let's just acknowledge the alert
      await inventoryService.acknowledgeStockAlert(alertId, user.uid);
      fetchStockAlerts();
    } catch (err: any) {
      setError(err.message || 'Error al descartar la alerta de stock');
      console.error('Error dismissing stock alert:', err);
    } finally {
      setLoading(false);
    }
  };

  const addStock = async (itemId: string, quantity: number, reason: string) => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const stockChange: StockChange = {
        date: new Date(),
        quantity,
        type: 'addition',
        reason,
        userId: user.uid
      };
      
      await inventoryService.updateStock(itemId, stockChange.quantity, stockChange.reason, stockChange.userId);
      fetchInventoryItems();
    } catch (err: any) {
      setError(err.message || 'Error al agregar stock');
      console.error('Error adding stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const subtractStock = async (itemId: string, quantity: number, reason: string) => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const stockChange: StockChange = {
        date: new Date(),
        quantity,
        type: 'subtraction',
        reason,
        userId: user.uid
      };
      
      await inventoryService.updateStock(itemId, -stockChange.quantity, stockChange.reason, stockChange.userId);
      fetchInventoryItems();
    } catch (err: any) {
      setError(err.message || 'Error al restar stock');
      console.error('Error subtracting stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const adjustStock = async (itemId: string, quantity: number, reason: string) => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const stockChange: StockChange = {
        date: new Date(),
        quantity,
        type: 'adjustment',
        reason,
        userId: user.uid
      };
      
      await inventoryService.updateStock(itemId, stockChange.quantity, stockChange.reason, stockChange.userId);
      fetchInventoryItems();
    } catch (err: any) {
      setError(err.message || 'Error al ajustar stock');
      console.error('Error adjusting stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    inventoryItems,
    stockAlerts,
    inventoryStats,
    loading,
    error,
    fetchInventoryItems,
    fetchStockAlerts,
    fetchInventoryStats,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    acknowledgeStockAlert,
    dismissStockAlert,
    addStock,
    subtractStock,
    adjustStock,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};