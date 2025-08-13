// src/services/userService.ts
import { doc, getDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

class UserService {
  /**
   * Get user profile by ID
   */
  async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: userDoc.id,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'user'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  /**
   * Get multiple users by their IDs
   */
  async getUsersByIds(userIds: string[]): Promise<Record<string, UserProfile>> {
    try {
      const users: Record<string, UserProfile> = {};
      
      // Fetch users in batches (Firestore 'in' query limit is 10)
      const batchSize = 10;
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        
        const q = query(
          collection(db, 'users'),
          where('__name__', 'in', batch)
        );
        
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          users[doc.id] = {
            id: doc.id,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            role: userData.role || 'user'
          };
        });
      }
      
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return {};
    }
  }

  /**
   * Get formatted client name for display
   */
  getClientDisplayName(user: UserProfile | null): string {
    if (!user) return 'Cliente Desconocido';
    
    const firstName = user.firstName?.trim() || '';
    const lastName = user.lastName?.trim() || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else if (user.email) {
      return user.email.split('@')[0]; // Use email username as fallback
    } else {
      return `Cliente ${user.id.slice(-6)}`;
    }
  }

  /**
   * Get formatted client names for multiple user IDs
   */
  async getClientNames(userIds: string[]): Promise<Record<string, string>> {
    try {
      const users = await this.getUsersByIds(userIds);
      const clientNames: Record<string, string> = {};
      
      userIds.forEach(userId => {
        const user = users[userId];
        clientNames[userId] = this.getClientDisplayName(user);
      });
      
      return clientNames;
    } catch (error) {
      console.error('Error getting client names:', error);
      
      // Return fallback names
      const fallbackNames: Record<string, string> = {};
      userIds.forEach(userId => {
        fallbackNames[userId] = `Cliente ${userId.slice(-6)}`;
      });
      return fallbackNames;
    }
  }
}

export default new UserService();