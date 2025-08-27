import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import ImageDisplay from './ImageDisplay';
import AvailabilityToggle from './AvailabilityToggle';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Edit, Trash2, Eye, EyeOff, Package, AlertTriangle } from 'lucide-react';
import { getButtonClass } from '../../../utils/themeHelper';

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
    if (pastry.inventory === 0) return { status: 'out', color: 'red', text: 'Sin Stock', badgeClass: 'badge-error' };
    if (pastry.inventory <= 5) return { status: 'low', color: 'orange', text: 'Stock Bajo', badgeClass: 'badge-warning' };
    return { status: 'good', color: 'green', text: 'En Stock', badgeClass: 'badge-success' };
  };

  const stockStatus = getStockStatus();

  if (viewMode === 'list') {
    return (
      <div className="card-interactive shadow-brand-lg">
        <div className="flex p-6 gap-6">
          {/* Image */}
          <div className="flex-shrink-0">
            <ImageDisplay
              images={pastry.images || []}
              alt={pastry.name}
              className="w-24 h-24 rounded-xl"
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 truncate mb-1">
                  {pastry.name}
                </h3>
                <p className="text-sm text-purple-600 font-medium mb-3">{categoryName}</p>
                <p className="text-gray-700 line-clamp-2 leading-relaxed">{pastry.description}</p>
              </div>
              
              {/* Price and Status */}
              <div className="flex flex-col items-end gap-3 ml-6">
                <div className="text-2xl font-bold text-saffron-600">
                  ${pastry.price} MXN
                </div>
                
                {/* Stock Status */}
                <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${stockStatus.badgeClass}`}>
                  <Package size={14} />
                  {pastry.inventory} en stock
                </div>
                
                {/* Availability */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleQuickToggleAvailability}
                    disabled={updating}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      pastry.available
                        ? 'badge-success hover:bg-emerald-200 hover:scale-105'
                        : 'badge-error hover:bg-red-200 hover:scale-105'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {pastry.available ? <Eye size={14} /> : <EyeOff size={14} />}
                    {pastry.available ? 'Disponible' : 'Oculto'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => onEdit(pastry)}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all duration-200 font-medium"
              >
                <Edit size={16} />
                Editar
              </button>
              
              <button
                onClick={() => setIsDeleting(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 font-medium"
              >
                <Trash2 size={16} />
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
    <div className="card-interactive shadow-brand-lg overflow-hidden group">
      {/* Image Container */}
      <div className="relative aspect-square">
        <ImageDisplay
          images={pastry.images || []}
          alt={pastry.name}
          className="w-full h-full"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(pastry)}
              className="bg-white/90 backdrop-blur-sm text-purple-700 p-3 rounded-xl hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
              title="Editar postre"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => setIsDeleting(true)}
              className="bg-white/90 backdrop-blur-sm text-red-600 p-3 rounded-xl hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
              title="Eliminar postre"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!pastry.available && (
            <span className="badge-error shadow-lg">
              Oculto
            </span>
          )}
          
          {stockStatus.status === 'out' && (
            <span className="badge-error shadow-lg">
              Sin Stock
            </span>
          )}
          
          {stockStatus.status === 'low' && (
            <span className="badge-warning shadow-lg">
              Stock Bajo
            </span>
          )}
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-bold shadow-lg">
            ${pastry.price}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 truncate mb-2 text-lg">
            {pastry.name}
          </h3>
          <p className="text-sm text-purple-600 font-semibold">{categoryName}</p>
        </div>
        
        <p className="text-gray-700 text-sm line-clamp-2 mb-4 leading-relaxed">
          {pastry.description}
        </p>
        
        {/* Stock Info */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${stockStatus.badgeClass}`}>
            <Package size={12} />
            {pastry.inventory} restantes
          </div>
        </div>
        
        {/* Availability Toggle and Actions */}
        <div className="flex items-center justify-between">
          <AvailabilityToggle
            pastry={pastry}
            compact={true}
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(pastry)}
              className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-all duration-200 hover:scale-105"
              title="Editar postre"
            >
              <Edit size={16} />
            </button>
            
            <button
              onClick={() => setIsDeleting(true)}
              className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 hover:scale-105"
              title="Eliminar postre"
            >
              <Trash2 size={16} />
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