// src/services/businessService.ts - Extension for Order Settings
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Business, BusinessRegistrationData, createBusinessWithDefaults } from '../types/business';
import { OrderSettings, DEFAULT_ORDER_SETTINGS } from '../utils/orderScheduler';

class BusinessService {
  private collectionName = 'businesses';

  // Register a new business (used during registration flow)
  async registerBusiness(registrationData: BusinessRegistrationData): Promise<{ user: any, businessId: string }> {
    console.log('🏪 Registering new business:', registrationData.storeName);
    
    try {
      // Create the business first
      const businessId = await this.createBusiness(registrationData);
      
      // Return user data for authentication
      const user = {
        email: registrationData.email,
        name: registrationData.accountManager,
        businessId: businessId,
        role: 'admin'
      };
      
      console.log('✅ Business registered successfully:', businessId);
      return { user, businessId };
    } catch (error) {
      console.error('❌ Error registering business:', error);
      throw new Error('No se pudo registrar el negocio');
    }
  }

  // Create a new business with default order settings
  async createBusiness(registrationData: BusinessRegistrationData): Promise<string> {
    console.log('🏪 Creating new business:', registrationData.storeName);
    
    try {
      const businessData = createBusinessWithDefaults(registrationData);
      
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...businessData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      console.log('✅ Business created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating business:', error);
      throw new Error('No se pudo crear el negocio');
    }
  }

  // Get business by ID
  async getBusinessById(businessId: string): Promise<Business | null> {
    console.log('🔍 Getting business by ID:', businessId);
    
    try {
      const docRef = doc(db, this.collectionName, businessId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Business;
      }
      
      console.log('❌ Business not found:', businessId);
      return null;
    } catch (error) {
      console.error('❌ Error getting business:', error);
      throw new Error('No se pudo obtener la información del negocio');
    }
  }

  // Update business information
  async updateBusiness(businessId: string, updates: Partial<Business>): Promise<void> {
    console.log('📝 Updating business:', businessId, updates);
    
    try {
      const docRef = doc(db, this.collectionName, businessId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      console.log('✅ Business updated successfully');
    } catch (error) {
      console.error('❌ Error updating business:', error);
      throw new Error('No se pudo actualizar la información del negocio');
    }
  }

  // Update order settings specifically
  async updateOrderSettings(businessId: string, orderSettings: OrderSettings): Promise<void> {
    console.log('⚙️ Updating order settings for business:', businessId, orderSettings);
    
    try {
      const docRef = doc(db, this.collectionName, businessId);
      await updateDoc(docRef, {
        orderSettings,
        updatedAt: serverTimestamp(),
      });
      
      console.log('✅ Order settings updated successfully');
    } catch (error) {
      console.error('❌ Error updating order settings:', error);
      throw new Error('No se pudo actualizar la configuración de pedidos');
    }
  }

  // Get order settings for a business
  async getOrderSettings(businessId: string): Promise<OrderSettings> {
    console.log('⚙️ Getting order settings for business:', businessId);
    
    try {
      const business = await this.getBusinessById(businessId);
      
      if (!business) {
        throw new Error('Negocio no encontrado');
      }
      
      // Return order settings or default if not set
      return business.orderSettings || DEFAULT_ORDER_SETTINGS;
    } catch (error) {
      console.error('❌ Error getting order settings:', error);
      throw new Error('No se pudo obtener la configuración de pedidos');
    }
  }

  // Get all active businesses (for marketplace)
  async getActiveBusinesses(): Promise<Business[]> {
    console.log('🏪 Getting all active businesses');
    
    try {
      const q = query(
        collection(db, this.collectionName),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const businesses: Business[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        businesses.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Business);
      });
      
      console.log('✅ Found', businesses.length, 'active businesses');
      return businesses;
    } catch (error) {
      console.error('❌ Error getting active businesses:', error);
      throw new Error('No se pudieron obtener los negocios activos');
    }
  }

  // Migrate existing businesses to include order settings
  async migrateBusinessesToIncludeOrderSettings(): Promise<void> {
    console.log('🔄 Migrating businesses to include order settings');
    
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const updates: Promise<void>[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        
        // Check if business already has order settings
        if (!data.orderSettings) {
          console.log('🔄 Migrating business:', docSnapshot.id);
          
          const updatePromise = updateDoc(doc(db, this.collectionName, docSnapshot.id), {
            orderSettings: DEFAULT_ORDER_SETTINGS,
            updatedAt: serverTimestamp(),
          });
          
          updates.push(updatePromise);
        }
      });
      
      await Promise.all(updates);
      console.log('✅ Migration completed for', updates.length, 'businesses');
    } catch (error) {
      console.error('❌ Error during migration:', error);
      throw new Error('No se pudo completar la migración');
    }
  }

  // Validate order settings
  validateOrderSettings(orderSettings: OrderSettings): boolean {
    console.log('🔍 Validating order settings:', orderSettings);
    
    try {
      // Check required fields
      if (!orderSettings.cutoffTime || !orderSettings.morningOrderDeadline || !orderSettings.sameDayCompletionHour) {
        console.log('❌ Missing required time fields');
        return false;
      }
      
      // Validate time format (HH:MM)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(orderSettings.cutoffTime) || 
          !timeRegex.test(orderSettings.morningOrderDeadline) || 
          !timeRegex.test(orderSettings.sameDayCompletionHour)) {
        console.log('❌ Invalid time format');
        return false;
      }
      
      // Validate logical order of times
      const cutoff = orderSettings.cutoffTime;
      const morning = orderSettings.morningOrderDeadline;
      const completion = orderSettings.sameDayCompletionHour;
      
      if (morning >= cutoff) {
        console.log('❌ Morning deadline must be before cutoff time');
        return false;
      }
      
      if (completion <= morning) {
        console.log('❌ Completion hour must be after morning deadline');
        return false;
      }
      
      // Validate numeric fields
      if (orderSettings.defaultQueueDelay < 15 || orderSettings.defaultQueueDelay > 480) {
        console.log('❌ Invalid queue delay (must be 15-480 minutes)');
        return false;
      }
      
      if (orderSettings.minOrderAdvanceTime < 15 || orderSettings.minOrderAdvanceTime > 120) {
        console.log('❌ Invalid advance time (must be 15-120 minutes)');
        return false;
      }
      
      console.log('✅ Order settings validation passed');
      return true;
    } catch (error) {
      console.error('❌ Error validating order settings:', error);
      return false;
    }
  }

  // Get business hours for order scheduling
  async getBusinessHours(businessId: string) {
    console.log('⏰ Getting business hours for:', businessId);
    
    try {
      const business = await this.getBusinessById(businessId);
      
      if (!business) {
        throw new Error('Negocio no encontrado');
      }
      
      return business.operatingHours;
    } catch (error) {
      console.error('❌ Error getting business hours:', error);
      throw new Error('No se pudo obtener el horario del negocio');
    }
  }
}

// Export the service instance and individual functions for compatibility
export default new BusinessService();

// Named exports for backward compatibility
export const registerBusiness = (registrationData: BusinessRegistrationData) => {
  return new BusinessService().registerBusiness(registrationData);
};

export const createBusiness = (registrationData: BusinessRegistrationData) => {
  return new BusinessService().createBusiness(registrationData);
};

export const getBusinessById = (businessId: string) => {
  return new BusinessService().getBusinessById(businessId);
};

export const updateBusiness = (businessId: string, updates: Partial<Business>) => {
  return new BusinessService().updateBusiness(businessId, updates);
};

export const updateOrderSettings = (businessId: string, orderSettings: OrderSettings) => {
  return new BusinessService().updateOrderSettings(businessId, orderSettings);
};

export const getOrderSettings = (businessId: string) => {
  return new BusinessService().getOrderSettings(businessId);
};

export const getActiveBusinesses = () => {
  return new BusinessService().getActiveBusinesses();
};