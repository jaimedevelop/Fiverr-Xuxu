import React, { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../firebase/config';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ item, onClose }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== 'delete') {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Eliminar Postre</h3>
              <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            disabled={deleting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {/* Item Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex gap-3">
            {item.images && item.images.length > 0 && (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-600">${item.price} MXN</p>
              <p className="text-xs text-gray-500">
                {item.inventory || 0} en stock
              </p>
            </div>
          </div>
        </div>
        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex gap-3">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
            <div className="text-sm">
              <p className="text-red-800 font-medium mb-1">Esto eliminará permanentemente:</p>
              <ul className="text-red-700 space-y-1">
                <li>• El listado del postre y todos sus detalles</li>
                <li>• Todas las imágenes subidas</li>
                <li>• Cualquier referencia al historial de pedidos relacionada</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Confirmation Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escriba "eliminar" para confirmar:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={deleting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="eliminar"
          />
        </div>
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleting || confirmText.toLowerCase() !== 'delete'}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Esta acción es inmediata y no se puede revertir.</p>
          <p>Considere hacer que el artículo no esté disponible en su lugar si podría necesitarlo más tarde.</p>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;