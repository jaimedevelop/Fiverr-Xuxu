import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, Plus, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
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

  const handleRefresh = () => {
    fetchInventoryItems();
    fetchStockAlerts();
    fetchInventoryStats();
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

  if (loading && !inventoryItems && !mockInventoryItems) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  if (isFormVisible) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <InventoryForm
              item={selectedItem}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  Gestión de Inventario
                </h1>
                <p className="text-lg text-gray-600">
                  Controla tu stock, recibe alertas y optimiza tu inventario
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  <span className="hidden sm:inline">Actualizar</span>
                </button>
                <button
                  onClick={handleAddItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3"
                >
                  <Plus size={18} />
                  Nuevo Producto
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <FormError message={error} />
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Productos</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {inventoryStats?.totalItems || mockInventoryStats.totalItems}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Productos registrados</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Stock Bajo</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {inventoryStats?.lowStockItems || mockInventoryStats.lowStockItems}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">Requieren atención</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Productos Agotados</p>
                  <p className="text-3xl font-bold text-red-600">
                    {inventoryStats?.outOfStockItems || mockInventoryStats.outOfStockItems}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Sin stock disponible</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Valor Total del Inventario</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${inventoryStats?.totalValue || mockInventoryStats.totalValue}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Valor en productos</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stock Alerts Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Alertas de Stock
                  </h2>
                  <p className="text-gray-600">
                    Productos que requieren reabastecimiento
                  </p>
                </div>
                
                <StockAlerts
                  alerts={stockAlerts || mockStockAlerts}
                  onAcknowledge={handleAcknowledgeAlert}
                  onDismiss={handleDismissAlert}
                  loading={loading}
                />
              </div>
            </div>

            {/* Inventory List Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Lista de Productos
                  </h2>
                  <p className="text-gray-600">
                    Gestiona el inventario de todos tus productos
                  </p>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <LoadingSpinner />
                      <p className="text-gray-500">Cargando productos...</p>
                    </div>
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
              </div>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Productos Más Vendidos
              </h2>
              <p className="text-gray-600">
                Los productos con mayor rotación en tu inventario
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(inventoryStats?.topSellingItems || mockInventoryStats.topSellingItems).map((item, index) => (
                <div key={item.pastryId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.quantitySold} unidades vendidas
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Management Tips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Consejos de Gestión
              </h2>
              <p className="text-gray-600">
                Mejores prácticas para optimizar tu inventario
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-blue-800">Análisis de Rotación</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Revisa qué productos se venden más rápido para ajustar los niveles de stock mínimo.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <AlertTriangle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-green-800">Alertas Tempranas</h3>
                </div>
                <p className="text-sm text-green-700">
                  Configura alertas de stock bajo para evitar quedarte sin productos populares.
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-purple-800">Tendencias Estacionales</h3>
                </div>
                <p className="text-sm text-purple-700">
                  Considera las variaciones estacionales en la demanda para planificar tu inventario.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <Package className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="text-sm font-medium text-blue-800 mb-1">Restock Masivo</h4>
                <p className="text-xs text-blue-600">Actualizar múltiples productos</p>
              </button>
              
              <button className="bg-green-50 hover:bg-green-100 border border-green-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="text-sm font-medium text-green-800 mb-1">Reporte de Inventario</h4>
                <p className="text-xs text-green-600">Exportar datos actuales</p>
              </button>
              
              <button className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mb-2" />
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Configurar Alertas</h4>
                <p className="text-xs text-yellow-600">Ajustar niveles mínimos</p>
              </button>
              
              <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="text-sm font-medium text-purple-800 mb-1">Análisis de Tendencias</h4>
                <p className="text-xs text-purple-600">Ver patrones de consumo</p>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Inventory;