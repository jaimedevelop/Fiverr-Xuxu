import React, { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../firebase/config';
import { AlertTriangle, X } from 'lucide-react';
import { getButtonClass } from '../../../utils/themeHelper';

const DeleteConfirmModal = ({ item, onClose }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== 'eliminar') {
      alert('Por favor, escriba "eliminar" para confirmar');
      return;
    }
    setDeleting(true);
    try {
      // Delete images from storage
      if (item.images && item.images.length > 0) {
        const deletePromises = item.images.map(async (imageUrl) => {
          try {
            // Extract the path from the Firebase Storage URL
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.warn('Error deleting image:', error);
            // Continue with deletion even if image deletion fails
          }
        });
        await Promise.all(deletePromises);
      }
      // Delete the document
      await deleteDoc(doc(db, 'pastries', item.id));
      
      onClose();
    } catch (error) {
      console.error('Error deleting pastry:', error);
      alert('Error al eliminar el postre. Por favor, inténtelo de nuevo.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-base max-w-md w-full p-6 shadow-brand-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Eliminar Postre</h3>
              <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            disabled={deleting}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Item Details */}
        <div className="card-base p-4 mb-6 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex gap-4">
            {item.images && item.images.length > 0 && (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover shadow-md"
              />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
              <p className="text-saffron-600 font-semibold">${item.price} MXN</p>
              <p className="text-xs text-gray-500 mt-1">
                {item.inventory || 0} en stock
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-sm">
              <p className="text-red-800 font-bold mb-2">Esto eliminará permanentemente:</p>
              <ul className="text-red-700 space-y-1 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  El listado del postre y todos sus detalles
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Todas las imágenes subidas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Cualquier referencia al historial de pedidos relacionada
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Confirmation Input */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Escriba "eliminar" para confirmar:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={deleting}
            className="input-base font-mono text-center"
            placeholder="eliminar"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className={`flex-1 ${getButtonClass('outline')} disabled:opacity-50`}
          >
            Cancelar
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleting || confirmText.toLowerCase() !== 'eliminar'}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-red"
          >
            {deleting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Eliminando...
              </span>
            ) : (
              'Eliminar Postre'
            )}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="text-xs text-amber-800 text-center space-y-1">
            <p className="font-semibold">💡 Sugerencia:</p>
            <p>Esta acción es inmediata y no se puede revertir.</p>
            <p>Considere hacer que el artículo no esté disponible en su lugar si podría necesitarlo más tarde.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;