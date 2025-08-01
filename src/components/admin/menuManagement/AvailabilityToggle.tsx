import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Eye, EyeOff, Package, Settings } from 'lucide-react';

const AvailabilityToggle = ({ pastry, compact = false }) => {
  const [updating, setUpdating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleToggleAvailability = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'pastries', pastry.id), {
        available: !pastry.available,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Error al actualizar disponibilidad. Por favor intenta de nuevo.');
    } finally {
      setUpdating(false);
    }
  };

  const handleInventoryUpdate = async (newInventory) => {
    if (updating) return;
    setUpdating(true);
    try {
      const updates = {
        inventory: parseInt(newInventory),
        updatedAt: new Date()
      };
      // Auto-toggle availability based on inventory if using inventory-based availability
      if (pastry.availabilityMode === 'inventory') {
        updates.available = parseInt(newInventory) > 0;
      }
      await updateDoc(doc(db, 'pastries', pastry.id), updates);
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Error al actualizar inventario. Por favor intenta de nuevo.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAvailabilityModeChange = async (mode) => {
    if (updating) return;
    setUpdating(true);
    try {
      const updates = {
        availabilityMode: mode,
        updatedAt: new Date()
      };
      // If switching to inventory mode, set availability based on current inventory
      if (mode === 'inventory') {
        updates.available = pastry.inventory > 0;
      }
      await updateDoc(doc(db, 'pastries', pastry.id), updates);
      setShowSettings(false);
    } catch (error) {
      console.error('Error updating availability mode:', error);
      alert('Error al actualizar modo de disponibilidad. Por favor intenta de nuevo.');
    } finally {
      setUpdating(false);
    }
  };

  const availabilityMode = pastry.availabilityMode || 'manual';
  const isInventoryMode = availabilityMode === 'inventory';

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {/* Quick availability toggle */}
        <button
          onClick={handleToggleAvailability}
          disabled={updating || isInventoryMode}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
            pastry.available
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          } ${updating || isInventoryMode ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isInventoryMode ? 'Controlado por inventario' : 'Cambiar disponibilidad'}
        >
          {pastry.available ? <Eye size={10} /> : <EyeOff size={10} />}
          {pastry.available ? 'Activo' : 'Oculto'}
        </button>
        
        {/* Settings button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
          title="Configuración de disponibilidad"
        >
          <Settings size={12} />
        </button>
        
        {/* Settings dropdown */}
        {showSettings && (
          <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg p-3 min-w-48">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Modo de Disponibilidad
                </label>
                <select
                  value={availabilityMode}
                  onChange={(e) => handleAvailabilityModeChange(e.target.value)}
                  disabled={updating}
                  className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                >
                  <option value="manual">Control Manual</option>
                  <option value="inventory">Basado en Inventario</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Inventario Actual
                </label>
                <input
                  type="number"
                  min="0"
                  value={pastry.inventory || 0}
                  onChange={(e) => handleInventoryUpdate(e.target.value)}
                  disabled={updating}
                  className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full version
  return (
    <div className="space-y-4">
      {/* Availability Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Control de Disponibilidad
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAvailabilityModeChange('manual')}
            disabled={updating}
            className={`p-3 border rounded-lg text-sm transition-colors ${
              availabilityMode === 'manual'
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Eye size={16} />
              <span className="font-medium">Control Manual</span>
            </div>
            <p className="text-xs text-gray-600">
              Controla la disponibilidad manualmente con un interruptor
            </p>
          </button>
          <button
            onClick={() => handleAvailabilityModeChange('inventory')}
            disabled={updating}
            className={`p-3 border rounded-lg text-sm transition-colors ${
              availabilityMode === 'inventory'
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Package size={16} />
              <span className="font-medium">Basado en Inventario</span>
            </div>
            <p className="text-xs text-gray-600">
              Ocultar automáticamente cuando esté agotado
            </p>
          </button>
        </div>
      </div>
      
      {/* Manual Toggle */}
      {availabilityMode === 'manual' && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">Visibilidad del Producto</div>
            <div className="text-sm text-gray-600">
              {pastry.available ? 'Los clientes pueden ver y ordenar este producto' : 'Oculto de los clientes'}
            </div>
          </div>
          
          <button
            onClick={handleToggleAvailability}
            disabled={updating}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              pastry.available ? 'bg-green-600' : 'bg-gray-200'
            } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                pastry.available ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      )}
      
      {/* Inventory Management */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gestión de Inventario
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                min="0"
                value={pastry.inventory || 0}
                onChange={(e) => handleInventoryUpdate(e.target.value)}
                disabled={updating}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cantidad en stock"
              />
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {pastry.inventory === 0 && <span className="text-red-600 font-medium">Agotado</span>}
            {pastry.inventory > 0 && pastry.inventory <= 5 && <span className="text-orange-600 font-medium">Stock bajo</span>}
            {pastry.inventory > 5 && <span className="text-green-600 font-medium">En stock</span>}
          </div>
        </div>
      </div>
      
      {/* Status Display */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            pastry.available ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <div>
            <div className="font-medium text-gray-900">
              {pastry.available ? 'Disponible para Clientes' : 'Oculto para Clientes'}
            </div>
            <div className="text-sm text-gray-600">
              {isInventoryMode 
                ? `Controlado por inventario (${pastry.inventory || 0} en stock)`
                : 'Controlado manualmente'
              }
            </div>
          </div>
        </div>
        
        {pastry.available ? (
          <div className="flex items-center gap-1 text-green-600">
            <Eye size={16} />
            <span className="text-sm font-medium">Activo</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-600">
            <EyeOff size={16} />
            <span className="text-sm font-medium">Oculto</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityToggle;