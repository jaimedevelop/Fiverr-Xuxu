import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../../contexts/FavoritesContext';
import { useAuth } from '../../../contexts/AuthContext';
import AuthPromptModal from './AuthPromptModal';

interface FavoriteButtonProps {
  pastryId: string;
}

const FavoriteButton = ({ pastryId }: FavoriteButtonProps) => {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { addFavorite, removeFavorite, isFavorite: checkIsFavorite, loading } = useFavorites();
  const { authState } = useAuth();
  const { user } = authState;
  
  const isFavorited = checkIsFavorite(pastryId);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    
    try {
      if (isFavorited) {
        await removeFavorite(pastryId);
      } else {
        await addFavorite(pastryId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <>
      <button
        onClick={handleFavoriteClick}
        disabled={loading}
        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
        aria-label={isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        <Heart
          className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
          fill={isFavorited ? 'currentColor' : 'none'}
        />
      </button>
      
      {showAuthPrompt && (
        <AuthPromptModal
          onClose={() => setShowAuthPrompt(false)}
          message="Para añadir pasteles a tus favoritos, necesitas crear una cuenta."
        />
      )}
    </>
  );
};

export default FavoriteButton;