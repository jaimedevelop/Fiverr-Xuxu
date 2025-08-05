import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { useInventory } from '../../contexts/InventoryContext';
import { InventoryWithDetails, StockAlert } from '../../types/inventory';
import InventoryList from '../../components/admin/inventory/InventoryList';
import InventoryForm from '../../components/admin/inventory/InventoryForm';
import StockAlerts from '../../components/admin/inventory/StockAlerts';
import BaseCard from '../../components/common/BaseCard';
import FormError from '../../components/common/FormError';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Inventory: React.FC = () => {
  const {
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
    dismissStockAlert
  } = useInventory();

  const [selectedItem, setSelectedItem] = useState<InventoryWithDetails | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchInventoryItems();
    fetchStockAlerts();
    fetchInventoryStats();
  }, []);

  const handleViewDetails = (item: InventoryWithDetails) => {
    setSelectedItem(item);
    setIsFormVisible(true);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsFormVisible(true);
  };

  const handleEdit = (item: InventoryWithDetails) => {
    setSelectedItem(item);
    setIsFormVisible(true);
  };

  const handleDelete = (itemId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteInventoryItem(itemId);
    }
  };

  const handleSave = (itemData: Partial<InventoryWithDetails>) => {
    if (selectedItem) {
      updateInventoryItem(selectedItem.id, itemData);
    } else {
      createInventoryItem(itemData);
    }
    setIsFormVisible(false);
    setSelectedItem(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setSelectedItem(null);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    acknowledgeStockAlert(alertId);
  };

  const handleDismissAlert = (alertId: string) => {
    dismissStockAlert(alertId);
  };

  // Mock data for development
  const mockInventoryItems: InventoryWithDetails[] = [
    {
      id: '1',
      businessId: 'business1',
      pastryId: 'pastry1',
      currentStock: 25,
      minimumStock: 10,
      lastUpdated: new Date(),
      pastryName: 'Croissant de Chocolate',
      categoryName: 'Panadería',
      unitPrice: 25,
      isLowStock: false
    },
    {
      id: '2',
      businessId: 'business1',
      pastryId: 'pastry2',
      currentStock: 8,
      minimumStock: 15,
      lastUpdated: new Date(),
      pastryName: 'Concha',
      categoryName: 'Panadería',
      unitPrice: 15,
      isLowStock: true
    },
    {
      id: '3',
      businessId: 'business1',
      pastryId: 'pastry3',
      currentStock: 0,
      minimumStock: 5,
      lastUpdated: new Date(),
      pastryName: 'Pastel de Chocolate',
      categoryName: 'Repostería',
      unitPrice: 65,
      isLowStock: true
    },
    {
      id: '4',
      businessId: 'business1',
      pastryId: 'pastry4',
      currentStock: 30,
      minimumStock: 20,
      lastUpdated: new Date(),
      pastryName: 'Donut',
      categoryName: 'Panadería',
      unitPrice: 20,
      isLowStock: false
    },
    {
      id: '5',
      businessId: 'business1',
      pastryId: 'pastry5',
      currentStock: 12,
      minimumStock: 10,
      lastUpdated: new Date(),
      pastryName: 'Empanada de Pollo',
      categoryName: 'Salados',
      unitPrice: 30,
      isLowStock: false
    }
  ];

  const mockStockAlerts: StockAlert[] = [
    {
      id: '1',
      businessId: 'business1',
      pastryId: 'pastry2',
      pastryName: 'Concha',
      currentStock: 8,
      minimumStock: 15,
      severity: 'low',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      acknowledged: false
    },
    {
      id: '2',
      businessId: 'business1',
      pastryId: 'pastry3',
      pastryName: 'Pastel de Chocolate',
      currentStock: 0,
      minimumStock: 5,
      severity: 'critical',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      acknowledged: true,
      acknowledgedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      acknowledgedBy: 'user1'
    }
  ];

  const mockInventoryStats = {
    totalItems: 5,
    lowStockItems: 2,
    outOfStockItems: 1,
    totalValue: 2450,
    topSellingItems: [
      {
        pastryId: 'pastry1',
        name: 'Croissant de Chocolate',
        quantitySold: 45
      },
      {
        pastryId: 'pastry2',
        name: 'Concha',
        quantitySold: 38
      }
    ]
  };

  if (isFormVisible) {
    return (
      <div className="p-6">
        <InventoryForm
          item={selectedItem}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
        <p className="text-gray-600">Gestiona tu inventario y recibe alertas de stock</p>
      </div>

      {error && <div className="mb-6"><FormError message={error} /></div>}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total de productos</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats?.totalItems || mockInventoryStats.totalItems}</p>
            </div>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Stock bajo</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats?.lowStockItems || mockInventoryStats.lowStockItems}</p>
            </div>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Agotados</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats?.outOfStockItems || mockInventoryStats.outOfStockItems}</p>
            </div>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Valor total</p>
              <p className="text-2xl font-bold text-gray-900">
                ${inventoryStats?.totalValue || mockInventoryStats.totalValue}
              </p>
            </div>
          </div>
        </BaseCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stock Alerts */}
        <div className="lg:col-span-1">
          <StockAlerts
            alerts={stockAlerts || mockStockAlerts}
            onAcknowledge={handleAcknowledgeAlert}
            onDismiss={handleDismissAlert}
            loading={loading}
          />
        </div>

        {/* Inventory List */}
        <div className="lg:col-span-2">
          <BaseCard title="Productos">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <InventoryList
                items={inventoryItems || mockInventoryItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAddItem}
                loading={loading}
              />
            )}
          </BaseCard>
        </div>
      </div>
    </div>
  );
};

export default Inventory;