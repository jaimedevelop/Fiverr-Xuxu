import React from 'react';
import MenuItemCard from './MenuItemCard';
import { Package } from 'lucide-react';

const MenuList = ({ pastries, categories, viewMode, onEdit }) => {
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin Categoría';
  };

  if (pastries.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron postres</h3>
        <p className="text-gray-500 mb-4">
          {pastries.length === 0 ? 
            "Comience añadiendo su primer postre al menú." :
            "Intente ajustar sus filtros para ver más resultados."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pastries.map(pastry => (
            <MenuItemCard
              key={pastry.id}
              pastry={pastry}
              categoryName={getCategoryName(pastry.categoryId)}
              viewMode="grid"
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {pastries.map(pastry => (
            <MenuItemCard
              key={pastry.id}
              pastry={pastry}
              categoryName={getCategoryName(pastry.categoryId)}
              viewMode="list"
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
      
      {/* Load More Button (for future pagination) */}
      {pastries.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Mostrando {pastries.length} postres
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuList;