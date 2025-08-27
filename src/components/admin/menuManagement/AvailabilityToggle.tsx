import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Eye, EyeOff, Package, Settings } from 'lucide-react';
import { getButtonClass } from '../../../utils/themeHelper';

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
      <div className="flex items-center gap-2 relative">
        {/* Quick availability toggle */}
        <button
          onClick={handleToggleAvailability}
          disabled={updating || isInventoryMode}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            pastry.available
              ? 'badge-success hover:bg-emerald-200'
              : 'badge-error hover:bg-red-200'
          } ${updating || isInventoryMode ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          title={isInventoryMode ? 'Controlado por inventario' : 'Cambiar disponibilidad'}
        >
          {pastry.available ? <Eye size={12} /> : <EyeOff size={12} />}
          {pastry.available ? 'Activo' : 'Oculto'}
        </button>
        
        {/* Settings button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-400 hover:text-purple-600 p-1 rounded-lg hover:bg-purple-50 transition-all duration-200"
          title="Configuración de disponibilidad"
        >
          <Settings size={14} />
        </button>
        
        {/* Settings dropdown */}
        {showSettings && (
          <div className="absolute z-10 top-8 right-0 bg-white/95 backdrop-blur-sm border border-white/50 rounded-xl shadow-brand-lg p-4 min-w-64">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Modo de Disponibilidad
                </label>
                <select
                  value={availabilityMode}
                  onChange={(e) => handleAvailabilityModeChange(e.target.value)}
                  disabled={updating}
                  className="input-base text-sm"
                >
                  <option value="manual">Control Manual</option>
                  <option value="inventory">Basado en Inventario</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Inventario Actual
                </label>
                <input
                  type="number"
                  min="0"
                  value={pastry.inventory || 0}
                  onChange={(e) => handleInventoryUpdate(e.target.value)}
                  disabled={updating}
                  className="input-base text-sm"
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
    <div className="space-y-6">
      {/* Availability Mode Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Control de Disponibilidad
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAvailabilityModeChange('manual')}
            disabled={updating}
            className={`card-base p-4 text-sm transition-all duration-300 hover:scale-105 ${
              availabilityMode === 'manual'
                ? 'bg-purple-50 border-purple-200 shadow-purple'
                : 'hover:shadow-brand-lg'
            } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Eye size={18} className={availabilityMode === 'manual' ? 'text-purple-600' : 'text-gray-600'} />
              <span className="font-semibold text-gray-900">Control Manual</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Controla la disponibilidad manualmente con un interruptor
            </p>
          </button>
          
          <button
            onClick={() => handleAvailabilityModeChange('inventory')}
            disabled={updating}
            className={`card-base p-4 text-sm transition-all duration-300 hover:scale-105 ${
              availabilityMode === 'inventory'
                ? 'bg-purple-50 border-purple-200 shadow-purple'
                : 'hover:shadow-brand-lg'
            } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Package size={18} className={availabilityMode === 'inventory' ? 'text-purple-600' : 'text-gray-600'} />
              <span className="font-semibold text-gray-900">Basado en Inventario</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ocultar automáticamente cuando esté agotado
            </p>
          </button>
        </div>
      </div>
      
      {/* Manual Toggle */}
      {availabilityMode === 'manual' && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900 mb-1">Visibilidad del Producto</div>
              <div className="text-sm text-gray-600">
                {pastry.available ? 'Los clientes pueden ver y ordenar este producto' : 'Oculto de los clientes'}
              </div>
            </div>
            
            <button
              onClick={handleToggleAvailability}
              disabled={updating}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                pastry.available ? 'bg-emerald-500 shadow-emerald' : 'bg-gray-300'
              } ${updating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                  pastry.available ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}
      
      {/* Inventory Management */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Gestión de Inventario
        </label>
        <div className="card-base p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                <input
                  type="number"
                  min="0"
                  value={pastry.inventory || 0}
                  onChange={(e) => handleInventoryUpdate(e.target.value)}
                  disabled={updating}
                  className="input-base pl-11"
                  placeholder="Cantidad en stock"
                />
              </div>
            </div>
            
            <div className="text-sm font-medium">
              {pastry.inventory === 0 && <span className="badge-error">Agotado</span>}
              {pastry.inventory > 0 && pastry.inventory <= 5 && <span className="badge-warning">Stock bajo</span>}
              {pastry.inventory > 5 && <span className="badge-success">En stock</span>}
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Display */}
      <div className="card-base p-6 border-2 border-dashed">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full shadow-sm ${
              pastry.available ? 'bg-emerald-500' : 'bg-red-500'
            }`} />
            <div>
              <div className="font-semibold text-gray-900">
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
            <div className="flex items-center gap-2 text-emerald-600">
              <Eye size={18} />
              <span className="text-sm font-semibold">Activo</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <EyeOff size={18} />
              <span className="text-sm font-semibold">Oculto</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityToggle;