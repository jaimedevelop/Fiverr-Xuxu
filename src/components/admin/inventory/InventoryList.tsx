import React from 'react';
import { Plus, Edit, Trash2, Package, AlertTriangle, DollarSign } from 'lucide-react';
import { InventoryWithDetails } from '../../../types/inventory';
import { getButtonClass, colors } from '../../../utils/themeHelper';
import BaseCard from '../../../components/common/BaseCard';

interface InventoryListProps {
  items: InventoryWithDetails[];
  onEdit: (item: InventoryWithDetails) => void;
  onDelete: (itemId: string) => void;
  onAdd: () => void;
  loading?: boolean;
}

const InventoryList: React.FC<InventoryListProps> = ({ 
  items, 
  onEdit, 
  onDelete, 
  onAdd, 
  loading = false 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getStockStatus = (item: InventoryWithDetails) => {
    if (item.currentStock <= 0) {
      return { status: 'out-of-stock', text: 'Agotado', color: 'badge-closed' };
    } else if (item.currentStock < item.minimumStock) {
      return { status: 'low-stock', text: 'Stock bajo', color: 'bg-amber-100 text-amber-800' };
    } else {
      return { status: 'in-stock', text: 'En stock', color: 'badge-success' };
    }
  };

  if (loading) {
    return (
      <div className="card-base p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 bg-gradient-saffron rounded-full flex items-center justify-center animate-pulse mb-4">
            <Package className="w-6 h-6 text-orange-900" />
          </div>
          <div className="space-y-2 text-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="h-3 bg-gray-100 rounded animate-pulse w-32"></div>
          </div>
          <p className="text-gray-600 font-medium mt-4">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card-base p-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay productos en inventario</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Agrega productos para comenzar a gestionar tu inventario y controlar el stock de tu negocio.
          </p>
          <button
            onClick={onAdd}
            className={getButtonClass('primary')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar primer producto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-saffron rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-orange-900" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Productos en Inventario
            </h2>
            <p className="text-sm text-gray-600">
              {items.length} producto{items.length !== 1 ? 's' : ''} registrado{items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <button
          onClick={onAdd}
          className={getButtonClass('admin')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar producto
        </button>
      </div>

      {/* Inventory Table */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/90 backdrop-blur-sm divide-y divide-gray-200">
              {items.map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <tr key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 bg-gradient-to-br from-saffron-100 to-saffron-200 rounded-xl flex items-center justify-center border-2 border-white shadow-sm">
                            <Package className="h-6 w-6 text-saffron-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{item.pastryName}</div>
                          <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                            ID: {item.pastryId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(item.unitPrice)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {item.currentStock} unidades
                          </span>
                          <span className="text-xs text-gray-500">
                            Mín: {item.minimumStock}
                          </span>
                        </div>
                        {item.currentStock < item.minimumStock && (
                          <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full badge-base ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                          title="Editar producto"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Productos</p>
              <p className="text-2xl font-bold text-blue-900">{items.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-800">En Stock</p>
              <p className="text-2xl font-bold text-emerald-900">
                {items.filter(item => item.currentStock > item.minimumStock).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Stock Bajo</p>
              <p className="text-2xl font-bold text-amber-900">
                {items.filter(item => item.currentStock > 0 && item.currentStock < item.minimumStock).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Agotados</p>
              <p className="text-2xl font-bold text-red-900">
                {items.filter(item => item.currentStock <= 0).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;