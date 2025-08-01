import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import ImageDisplay from './ImageDisplay';
import AvailabilityToggle from './AvailabilityToggle';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Edit, Trash2, Eye, EyeOff, Package, AlertTriangle } from 'lucide-react';

const MenuItemCard = ({ pastry, categoryName, viewMode, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleQuickToggleAvailability = async () => {
    if (updating) return;
    
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'pastries', pastry.id), {
        available: !pastry.available,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Error al actualizar disponibilidad. Por favor, inténtelo de nuevo.');
    } finally {
      setUpdating(false);
    }
  };

  const getStockStatus = () => {
    if (pastry.inventory === 0) return { status: 'out', color: 'red', text: 'Sin Stock' };
    if (pastry.inventory <= 5) return { status: 'low', color: 'orange', text: 'Stock Bajo' };
    return { status: 'good', color: 'green', text: 'En Stock' };
  };

  const stockStatus = getStockStatus();

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border hover:shadow-md transition-shadow">
        <div className="flex p-4 gap-4">
          {/* Image */}
          <div className="flex-shrink-0">
            <ImageDisplay
              images={pastry.images || []}
              alt={pastry.name}
              className="w-20 h-20 rounded-lg"
            />
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {pastry.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{categoryName}</p>
                <p className="text-gray-700 line-clamp-2">{pastry.description}</p>
              </div>
              {/* Price and Status */}
              <div className="flex flex-col items-end gap-2 ml-4">
                <div className="text-xl font-bold text-gray-900">
                  ${pastry.price} MXN
                </div>
                
                {/* Stock Status */}
                <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-${stockStatus.color}-100 text-${stockStatus.color}-800`}>
                  <Package size={12} />
                  {pastry.inventory} en stock
                </div>
                {/* Availability */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleQuickToggleAvailability}
                    disabled={updating}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                      pastry.available
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {pastry.available ? <Eye size={12} /> : <EyeOff size={12} />}
                    {pastry.available ? 'Disponible' : 'Oculto'}
                  </button>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => onEdit(pastry)}
                className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Edit size={14} />
                Editar
              </button>
              
              <button
                onClick={() => setIsDeleting(true)}
                className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 size={14} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
        {isDeleting && (
          <DeleteConfirmModal
            item={pastry}
            onClose={() => setIsDeleting(false)}
          />
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg border hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Image Container */}
      <div className="relative aspect-square">
        <ImageDisplay
          images={pastry.images || []}
          alt={pastry.name}
          className="w-full h-full"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(pastry)}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => setIsDeleting(true)}
              className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {!pastry.available && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Oculto
            </span>
          )}
          
          {stockStatus.status === 'out' && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Sin Stock
            </span>
          )}
          
          {stockStatus.status === 'low' && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Stock Bajo
            </span>
          )}
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm font-bold">
            ${pastry.price}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 truncate mb-1">
            {pastry.name}
          </h3>
          <p className="text-sm text-gray-600">{categoryName}</p>
        </div>
        <p className="text-gray-700 text-sm line-clamp-2 mb-3">
          {pastry.description}
        </p>
        
        {/* Stock Info */}
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-${stockStatus.color}-100 text-${stockStatus.color}-800`}>
            <Package size={12} />
            {pastry.inventory} restantes
          </div>
        </div>
        
        {/* Availability Toggle */}
        <div className="flex items-center justify-between">
          <AvailabilityToggle
            pastry={pastry}
            compact={true}
          />
          
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(pastry)}
              className="text-blue-600 hover:bg-blue-50 p-1 rounded-md transition-colors"
              title="Editar postre"
            >
              <Edit size={14} />
            </button>
            
            <button
              onClick={() => setIsDeleting(true)}
              className="text-red-600 hover:bg-red-50 p-1 rounded-md transition-colors"
              title="Eliminar postre"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
      
      {isDeleting && (
        <DeleteConfirmModal
          item={pastry}
          onClose={() => setIsDeleting(false)}
        />
      )}
    </div>
  );
};

export default MenuItemCard;