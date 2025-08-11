// src/firebase/database.ts
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
      q = query(q, where('vendorId', '==', vendorId));
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

// ORDERS COLLECTION
export const createOrder = async (orderData: DocumentData): Promise<DocumentResult> => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'received',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const getOrders = async (userId: string, role: string = 'customer'): Promise<DataResult<DocumentData>> => {
  try {
    let q: Query = collection(db, 'orders');
    
    if (role === 'customer') {
      q = query(q, where('customerId', '==', userId));
    } else if (role === 'admin') {
      q = query(q, where('vendorId', '==', userId));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const orders: DocumentData[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      orders.push({ id: doc.id, ...doc.data() });
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

// REAL-TIME LISTENERS
export const listenToOrders = (userId: string, role: string, callback: (orders: DocumentData[]) => void): Unsubscribe => {
  let q: Query = collection(db, 'orders');
  
  if (role === 'customer') {
    q = query(q, where('customerId', '==', userId));
  } else if (role === 'admin') {
    q = query(q, where('vendorId', '==', userId));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const orders: DocumentData[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    callback(orders);
  });
};

export const listenToPastries = (vendorId: string | null, callback: (pastries: DocumentData[]) => void): Unsubscribe => {
  let q: Query = collection(db, 'pastries');
  
  if (vendorId) {
    q = query(q, where('vendorId', '==', vendorId));
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