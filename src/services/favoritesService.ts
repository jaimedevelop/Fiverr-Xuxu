import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Pastry } from '../types/pastry';

export interface Favorite {
  id: string;
  userId: string;
  pastryId: string;
  createdAt: Date;
}

class FavoritesService {
  private collectionName = 'favorites';

  // Create a new favorite
  async createFavorite(userId: string, pastryId: string): Promise<string> {
    try {
      // Check if favorite already exists
      const existingFavorite = await this.getFavoriteByUserAndPastry(userId, pastryId);
      if (existingFavorite) {
        return existingFavorite.id; // Already favorited
      }

      const docRef = await addDoc(collection(db, this.collectionName), {
        userId,
        pastryId,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating favorite:', error);
      throw new Error('No se pudo crear el favorito');
    }
  }

  // Get a favorite by user and pastry
  async getFavoriteByUserAndPastry(userId: string, pastryId: string): Promise<Favorite | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('pastryId', '==', pastryId)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        pastryId: data.pastryId,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Favorite;
    } catch (error) {
      console.error('Error getting favorite:', error);
      throw new Error('No se pudo obtener el favorito');
    }
  }

  // Get all favorites for a user
  async getFavoritesByUser(userId: string): Promise<Favorite[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const favorites: Favorite[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        favorites.push({
          id: doc.id,
          userId: data.userId,
          pastryId: data.pastryId,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Favorite);
      });

      return favorites;
    } catch (error) {
      console.error('Error getting user favorites:', error);
      throw new Error('No se pudieron obtener los favoritos');
    }
  }

  // Get all favorite pastries for a user (with pastry details)
  async getFavoritePastriesByUser(userId: string): Promise<Pastry[]> {
    try {
      const favorites = await this.getFavoritesByUser(userId);
      
      if (favorites.length === 0) {
        return [];
      }

      // Get pastry details for each favorite
      const pastryIds = favorites.map(fav => fav.pastryId);
      const pastries: Pastry[] = [];

      // We need to fetch each pastry individually since we can't use 'in' with multiple values in Firestore
      for (const pastryId of pastryIds) {
        try {
          const pastryRef = doc(db, 'pastries', pastryId);
          const pastryDoc = await getDoc(pastryRef);
          
          if (pastryDoc.exists()) {
            const data = pastryDoc.data();
            pastries.push({
              id: pastryDoc.id,
              name: data.name,
              description: data.description,
              price: data.price,
              categoryId: data.categoryId,
              images: data.images || [],
              available: data.available,
              availabilityMode: data.availabilityMode || 'manual',
              inventory: data.inventory || 0,
              tags: data.tags || [],
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Pastry);
          }
        } catch (error) {
          console.error(`Error getting pastry ${pastryId}:`, error);
          // Continue with other pastries even if one fails
        }
      }

      return pastries;
    } catch (error) {
      console.error('Error getting favorite pastries:', error);
      throw new Error('No se pudieron obtener los pasteles favoritos');
    }
  }

  // Delete a favorite
  async deleteFavorite(favoriteId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, favoriteId));
    } catch (error) {
      console.error('Error deleting favorite:', error);
      throw new Error('No se pudo eliminar el favorito');
    }
  }

  // Delete a favorite by user and pastry
  async deleteFavoriteByUserAndPastry(userId: string, pastryId: string): Promise<void> {
    try {
      const favorite = await this.getFavoriteByUserAndPastry(userId, pastryId);
      if (favorite) {
        await this.deleteFavorite(favorite.id);
      }
    } catch (error) {
      console.error('Error deleting favorite by user and pastry:', error);
      throw new Error('No se pudo eliminar el favorito');
    }
  }

  // Check if a pastry is favorited by a user
  async isFavorited(userId: string, pastryId: string): Promise<boolean> {
    try {
      const favorite = await this.getFavoriteByUserAndPastry(userId, pastryId);
      return !!favorite;
    } catch (error) {
      console.error('Error checking if favorited:', error);
      return false;
    }
  }
}

export default new FavoritesService();