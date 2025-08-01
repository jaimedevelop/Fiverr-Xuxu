import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import AuthPromptModal from './AuthPromptModal';

interface FavoriteButtonProps {
  pastryId: string;
}

const FavoriteButton = ({ pastryId }: FavoriteButtonProps) => {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // In a real app, you would check if user is authenticated
    const isAuthenticated = false; // Replace with actual auth check
    
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    
    // Toggle favorite status
    setIsFavorite(!isFavorite);
    // In a real app, you would save this to Firebase
  };

  return (
    <>
      <button
        onClick={handleFavoriteClick}
        className="text-gray-400 hover:text-red-500 transition-colors"
        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        <Heart
          className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
          fill={isFavorite ? 'currentColor' : 'none'}
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