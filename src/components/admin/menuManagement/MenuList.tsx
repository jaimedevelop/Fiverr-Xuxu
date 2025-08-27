import React from 'react';
import MenuItemCard from './MenuItemCard';
import { Package } from 'lucide-react';
import { getButtonClass } from '../../../utils/themeHelper';

const MenuList = ({ pastries, categories, viewMode, onEdit }) => {
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin Categoría';
  };

  if (pastries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="h-10 w-10 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No se encontraron postres</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {pastries.length === 0 ? 
            "Comience añadiendo su primer postre al menú para que los clientes puedan descubrir sus deliciosas creaciones." :
            "Intente ajustar sus filtros para ver más resultados."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
        <div className="space-y-6">
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
      
      {/* Results Summary */}
      {pastries.length > 0 && (
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-50 rounded-xl">
            <Package className="text-purple-600" size={18} />
            <p className="text-sm font-semibold text-purple-700">
              Mostrando {pastries.length} {pastries.length === 1 ? 'postre' : 'postres'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;