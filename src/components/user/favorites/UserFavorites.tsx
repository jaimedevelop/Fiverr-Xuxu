import React, { useEffect } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useFavorites } from '../../../contexts/FavoritesContext';
import { useAuth } from '../../../contexts/AuthContext';
import PastryCard from '../../user/userMenu/PastryCard';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import BaseCard from '../../../components/common/BaseCard';

const UserFavorites: React.FC = () => {
  const { favoritePastries, loading, error, fetchFavoritePastries } = useFavorites();
  const { authState } = useAuth();
  const { user } = authState;

  useEffect(() => {
    if (user) {
      fetchFavoritePastries();
    }
  }, [user, fetchFavoritePastries]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <Heart className="h-full w-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Inicia sesión</h3>
        <p className="text-gray-500">
          Debes iniciar sesión para ver tus favoritos.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-red-400 mb-4">
          <Heart className="h-full w-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-gray-500 mb-4">
          {error}
        </p>
        <button
          onClick={fetchFavoritePastries}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (favoritePastries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <Heart className="h-full w-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes favoritos</h3>
        <p className="text-gray-500">
          Añade pasteles a tus favoritos para verlos aquí.
        </p>
      </div>
    );
  }

  const handlePastryClick = (pastry: any) => {
    // This would typically open a modal or navigate to a detail page
    console.log('Pastry clicked:', pastry);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Favoritos</h1>
        <p className="text-gray-600">Tus pasteles favoritos guardados</p>
      </div>

      <BaseCard>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritePastries.map((pastry) => (
            <PastryCard
              key={pastry.id}
              pastry={pastry}
              onClick={() => handlePastryClick(pastry)}
            />
          ))}
        </div>
      </BaseCard>
    </div>
  );
};

export default UserFavorites;