import React, { useState } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import CategoryForm from './CategoryForm';
import { Plus, Edit, Trash2, X, AlertTriangle, Tag } from 'lucide-react';
import { getButtonClass } from '../../../utils/themeHelper';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-base max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-brand-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-main">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestionar Categorías</h2>
            <p className="text-sm text-gray-600 mt-1">
              Organice sus postres en categorías para una mejor navegación
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-white/50 p-2 rounded-lg transition-all duration-200"
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
              className={`${getButtonClass('admin')} flex items-center gap-2`}
            >
              <Plus size={18} />
              Añadir Nueva Categoría
            </button>
          </div>

          {/* Categories List */}
          {categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tag className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Aún no hay categorías</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Cree su primera categoría para ayudar a organizar sus postres y mejorar la experiencia de navegación
              </p>
              <button
                onClick={handleAddNew}
                className={`${getButtonClass('admin')} inline-flex items-center gap-2`}
              >
                <Plus size={18} />
                Crear Primera Categoría
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-60">
            <div className="card-base max-w-md w-full p-6 shadow-brand-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Eliminar Categoría</h3>
                  <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
                </div>
              </div>

              <div className="card-base p-4 mb-6 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: deletingCategory.color }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{deletingCategory.name}</h4>
                    {deletingCategory.description && (
                      <p className="text-sm text-gray-600 mt-1">{deletingCategory.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-2">Antes de eliminar esta categoría:</p>
                    <p>Asegúrese de que no haya postres asignados a ella, o se volverán sin categorizar.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingCategory(null)}
                  disabled={deleting}
                  className={`flex-1 ${getButtonClass('outline')} disabled:opacity-50`}
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50 font-semibold"
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
    <div className="card-interactive p-6 hover:shadow-brand-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            {category.color && (
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: category.color }}
              />
            )}
            <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
            <span className="badge-base bg-purple-100 text-purple-700 font-semibold">
              {pastryCount} {pastryCount === 1 ? 'postre' : 'postres'}
            </span>
          </div>
          
          {category.description && (
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{category.description}</p>
          )}
          
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              Creado: {new Date(category.createdAt?.toDate?.() || category.createdAt).toLocaleDateString()}
            </span>
            {category.updatedAt && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                Actualizado: {new Date(category.updatedAt?.toDate?.() || category.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-6">
          <button
            onClick={() => onEdit(category)}
            className="text-purple-600 hover:bg-purple-50 p-3 rounded-xl transition-all duration-200 hover:scale-105"
            title="Editar categoría"
          >
            <Edit size={18} />
          </button>
          
          <button
            onClick={() => onDelete(category)}
            className="text-red-600 hover:bg-red-50 p-3 rounded-xl transition-all duration-200 hover:scale-105"
            title="Eliminar categoría"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;