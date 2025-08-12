// src/firebase/database.ts - FIXED VERSION
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  Unsubscribe,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Define result types
interface DocumentResult {
  id: string | null;
  error: string | null;
}

interface DataResult<T> {
  data: T[];
  error: string | null;
}

interface SingleDataResult<T> {
  data: T | null;
  error: string | null;
}

interface SimpleResult {
  error: string | null;
}

// PASTRIES COLLECTION
export const addPastry = async (pastryData: DocumentData): Promise<DocumentResult> => {
  try {
    const docRef = await addDoc(collection(db, 'pastries'), {
      ...pastryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const getPastries = async (vendorId: string | null = null): Promise<DataResult<DocumentData>> => {
  try {
    let q: Query = collection(db, 'pastries');
    
    if (vendorId) {
      q = query(q, where('businessId', '==', vendorId)); // FIXED: Use businessId instead of vendorId
    }
    
    q = query(q, where('available', '==', true), orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const pastries: DocumentData[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      pastries.push({ id: doc.id, ...doc.data() });
    });
    
    return { data: pastries, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

export const updatePastry = async (pastryId: string, updateData: DocumentData): Promise<SimpleResult> => {
  try {
    const pastryRef = doc(db, 'pastries', pastryId);
    await updateDoc(pastryRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deletePastry = async (pastryId: string): Promise<SimpleResult> => {
  try {
    await deleteDoc(doc(db, 'pastries', pastryId));
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// ORDERS COLLECTION - FIXED VERSION WITH PICKUP SUPPORT
export const createOrder = async (orderData: DocumentData): Promise<DocumentResult> => {
  try {
    // Ensure we have all required fields for the new order structure
    const completeOrderData = {
      ...orderData,
      status: orderData.status || 'pending',
      fulfillmentType: orderData.fulfillmentType || 'delivery', // Default to delivery if not specified
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Validate required fields based on fulfillment type
    if (completeOrderData.fulfillmentType === 'delivery' && !completeOrderData.deliveryAddress) {
      throw new Error('Delivery address is required for delivery orders');
    }

    if (completeOrderData.fulfillmentType === 'pickup' && !completeOrderData.pickupTime) {
      throw new Error('Pickup time is required for pickup orders');
    }

    const docRef = await addDoc(collection(db, 'orders'), completeOrderData);
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

// FIXED: Updated getOrders function to handle new order structure and use correct field names
export const getOrders = async (userId: string, role: string = 'customer', filters?: any): Promise<DataResult<DocumentData>> => {
  try {
    let q: Query = collection(db, 'orders');
    
    if (role === 'customer') {
      q = query(q, where('userId', '==', userId)); // FIXED: Use userId consistently
    } else if (role === 'admin') {
      q = query(q, where('businessId', '==', userId)); // FIXED: Use businessId consistently
    }

    // Add fulfillment type filter if specified
    if (filters?.fulfillmentType) {
      q = query(q, where('fulfillmentType', '==', filters.fulfillmentType));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const orders: DocumentData[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      const orderData = doc.data();
      
      // Convert Firestore timestamps to Date objects
      if (orderData.pickupTime?.datetime && orderData.pickupTime.datetime.toDate) {
        orderData.pickupTime.datetime = orderData.pickupTime.datetime.toDate();
      }
      if (orderData.estimatedDeliveryTime && orderData.estimatedDeliveryTime.toDate) {
        orderData.estimatedDeliveryTime = orderData.estimatedDeliveryTime.toDate();
      }
      if (orderData.createdAt && orderData.createdAt.toDate) {
        orderData.createdAt = orderData.createdAt.toDate();
      }
      if (orderData.updatedAt && orderData.updatedAt.toDate) {
        orderData.updatedAt = orderData.updatedAt.toDate();
      }
      
      orders.push({ id: doc.id, ...orderData });
    });
    
    return { data: orders, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

export const updateOrderStatus = async (orderId: string, status: string, notes: string = ''): Promise<SimpleResult> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      notes,
      statusHistory: arrayUnion({
        status,
        timestamp: serverTimestamp(),
        notes
      }),
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// FIXED: Single listenToOrders function with proper field names and pickup support
export const listenToOrders = (userId: string, role: string, callback: (orders: DocumentData[]) => void, filters?: any): Unsubscribe => {
  let q: Query = collection(db, 'orders');
  
  if (role === 'customer') {
    q = query(q, where('userId', '==', userId)); // FIXED: Use userId consistently
  } else if (role === 'admin') {
    q = query(q, where('businessId', '==', userId)); // FIXED: Use businessId consistently
  }

  // Add fulfillment type filter if specified
  if (filters?.fulfillmentType) {
    q = query(q, where('fulfillmentType', '==', filters.fulfillmentType));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const orders: DocumentData[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      const orderData = doc.data();
      
      // Convert Firestore timestamps to Date objects
      if (orderData.pickupTime?.datetime && orderData.pickupTime.datetime.toDate) {
        orderData.pickupTime.datetime = orderData.pickupTime.datetime.toDate();
      }
      if (orderData.estimatedDeliveryTime && orderData.estimatedDeliveryTime.toDate) {
        orderData.estimatedDeliveryTime = orderData.estimatedDeliveryTime.toDate();
      }
      if (orderData.createdAt && orderData.createdAt.toDate) {
        orderData.createdAt = orderData.createdAt.toDate();
      }
      if (orderData.updatedAt && orderData.updatedAt.toDate) {
        orderData.updatedAt = orderData.updatedAt.toDate();
      }
      
      orders.push({ id: doc.id, ...orderData });
    });
    callback(orders);
  });
};

export const listenToPastries = (vendorId: string | null, callback: (pastries: DocumentData[]) => void): Unsubscribe => {
  let q: Query = collection(db, 'pastries');
  
  if (vendorId) {
    q = query(q, where('businessId', '==', vendorId)); // FIXED: Use businessId instead of vendorId
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const pastries: DocumentData[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      pastries.push({ id: doc.id, ...doc.data() });
    });
    callback(pastries);
  });
};

// INVENTORY MANAGEMENT
export const updateInventory = async (pastryId: string, quantity: number): Promise<SimpleResult> => {
  try {
    const pastryRef = doc(db, 'pastries', pastryId);
    await updateDoc(pastryRef, {
      inventory: increment(-quantity),
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// FAVORITES
export const addToFavorites = async (userId: string, pastryId: string): Promise<SimpleResult> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: arrayUnion(pastryId),
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const removeFromFavorites = async (userId: string, pastryId: string): Promise<SimpleResult> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: arrayRemove(pastryId),
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};