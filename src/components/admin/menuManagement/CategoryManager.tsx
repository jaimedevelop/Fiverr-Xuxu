import React, { useState } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import CategoryForm from './CategoryForm';
import { Plus, Edit, Trash2, X, AlertTriangle, Tag } from 'lucide-react';

const CategoryManager = ({ categories, onClose }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteRequest = (category) => {
    setDeletingCategory(category);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    setDeleting(true);
    try {
      // Check if category is being used by any pastries
      const pastriesQuery = query(
        collection(db, 'pastries'),
        where('categoryId', '==', deletingCategory.id)
      );
      const pastriesSnapshot = await getDocs(pastriesQuery);
      if (!pastriesSnapshot.empty) {
        alert(`No se puede eliminar la categoría "${deletingCategory.name}" porque está siendo utilizada por ${pastriesSnapshot.size} ${pastriesSnapshot.size === 1 ? 'postre' : 'postres'}. Por favor, reasigne esos postres a otras categorías primero.`);
        setDeletingCategory(null);
        setDeleting(false);
        return;
      }
      // Delete the category
      await deleteDoc(doc(db, 'categories', deletingCategory.id));
      setDeletingCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría. Por favor, inténtelo de nuevo.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gestionar Categorías</h2>
            <p className="text-sm text-gray-600 mt-1">
              Organice sus postres en categorías para una mejor navegación
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Add Button */}
          <div className="mb-6">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Añadir Nueva Categoría
            </button>
          </div>
          {/* Categories List */}
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aún no hay categorías</h3>
              <p className="text-gray-500 mb-4">
                Cree su primera categoría para ayudar a organizar sus postres
              </p>
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Crear Categoría
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
        {/* Form Modal */}
        {isFormOpen && (
          <CategoryForm
            category={editingCategory}
            onClose={handleFormClose}
          />
        )}
        {/* Delete Confirmation */}
        {deletingCategory && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Eliminar Categoría</h3>
                  <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900">{deletingCategory.name}</h4>
                {deletingCategory.description && (
                  <p className="text-sm text-gray-600 mt-1">{deletingCategory.description}</p>
                )}
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                  <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">Antes de eliminar esta categoría:</p>
                    <p>Asegúrese de que no haya postres asignados a ella, o se volverán sin categorizar.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingCategory(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Eliminando...
                    </span>
                  ) : (
                    'Eliminar Categoría'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, onEdit, onDelete }) => {
  const [pastryCount, setPastryCount] = useState(0);
  
  // Get pastry count for this category
  React.useEffect(() => {
    const fetchPastryCount = async () => {
      try {
        const pastriesQuery = query(
          collection(db, 'pastries'),
          where('categoryId', '==', category.id)
        );
        const snapshot = await getDocs(pastriesQuery);
        setPastryCount(snapshot.size);
      } catch (error) {
        console.error('Error fetching pastry count:', error);
      }
    };
    fetchPastryCount();
  }, [category.id]);

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {category.color && (
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: category.color }}
              />
            )}
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              {pastryCount} {pastryCount === 1 ? 'postre' : 'postres'}
            </span>
          </div>
          
          {category.description && (
            <p className="text-sm text-gray-600">{category.description}</p>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>Creado: {new Date(category.createdAt?.toDate?.() || category.createdAt).toLocaleDateString()}</span>
            {category.updatedAt && (
              <span>Actualizado: {new Date(category.updatedAt?.toDate?.() || category.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(category)}
            className="text-blue-600 hover:bg-blue-50 p-2 rounded-md transition-colors"
            title="Editar categoría"
          >
            <Edit size={16} />
          </button>
          
          <button
            onClick={() => onDelete(category)}
            className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
            title="Eliminar categoría"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;