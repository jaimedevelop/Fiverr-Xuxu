import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import favoritesService from '../services/favoritesService';
import { Favorite } from '../services/favoritesService';
import { Pastry } from '../types/pastry';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Favorite[];
  favoritePastries: Pastry[];
  loading: boolean;
  error: string | null;
  addFavorite: (pastryId: string) => Promise<void>;
  removeFavorite: (pastryId: string) => Promise<void>;
  isFavorite: (pastryId: string) => boolean;
  fetchFavorites: () => Promise<void>;
  fetchFavoritePastries: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoritePastries, setFavoritePastries] = useState<Pastry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();
  const { user } = authState;

  // Fetch favorites for the current user
  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const favoritesData = await favoritesService.getFavoritesByUser(user.uid);
      setFavorites(favoritesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los favoritos');
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorite pastries for the current user
  const fetchFavoritePastries = async () => {
    if (!user) {
      setFavoritePastries([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pastriesData = await favoritesService.getFavoritePastriesByUser(user.uid);
      setFavoritePastries(pastriesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pasteles favoritos');
      console.error('Error fetching favorite pastries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a favorite
  const addFavorite = async (pastryId: string) => {
    if (!user) {
      setError('Debes iniciar sesión para añadir favoritos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await favoritesService.createFavorite(user.uid, pastryId);
      await fetchFavorites(); // Refresh the favorites list
    } catch (err: any) {
      setError(err.message || 'Error al añadir favorito');
      console.error('Error adding favorite:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove a favorite
  const removeFavorite = async (pastryId: string) => {
    if (!user) {
      setError('Debes iniciar sesión para eliminar favoritos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await favoritesService.deleteFavoriteByUserAndPastry(user.uid, pastryId);
      await fetchFavorites(); // Refresh the favorites list
    } catch (err: any) {
      setError(err.message || 'Error al eliminar favorito');
      console.error('Error removing favorite:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if a pastry is favorited
  const isFavorite = (pastryId: string) => {
    return favorites.some(fav => fav.pastryId === pastryId);
  };

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setFavoritePastries([]);
    }
  }, [user]);

  const value = {
    favorites,
    favoritePastries,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    fetchFavorites,
    fetchFavoritePastries,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};