// src/firebase/database.js
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
  arrayRemove
} from 'firebase/firestore';
import { db } from './config';

// PASTRIES COLLECTION
export const addPastry = async (pastryData) => {
  try {
    const docRef = await addDoc(collection(db, 'pastries'), {
      ...pastryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getPastries = async (vendorId = null) => {
  try {
    let q = collection(db, 'pastries');
    
    if (vendorId) {
      q = query(q, where('vendorId', '==', vendorId));
    }
    
    q = query(q, where('available', '==', true), orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const pastries = [];
    querySnapshot.forEach((doc) => {
      pastries.push({ id: doc.id, ...doc.data() });
    });
    
    return { data: pastries, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const updatePastry = async (pastryId, updateData) => {
  try {
    const pastryRef = doc(db, 'pastries', pastryId);
    await updateDoc(pastryRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const deletePastry = async (pastryId) => {
  try {
    await deleteDoc(doc(db, 'pastries', pastryId));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// ORDERS COLLECTION
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'received',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getOrders = async (userId, role = 'customer') => {
  try {
    let q = collection(db, 'orders');
    
    if (role === 'customer') {
      q = query(q, where('customerId', '==', userId));
    } else if (role === 'admin') {
      q = query(q, where('vendorId', '==', userId));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return { data: orders, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const updateOrderStatus = async (orderId, status, notes = '') => {
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
  } catch (error) {
    return { error: error.message };
  }
};

// REAL-TIME LISTENERS
export const listenToOrders = (userId, role, callback) => {
  let q = collection(db, 'orders');
  
  if (role === 'customer') {
    q = query(q, where('customerId', '==', userId));
  } else if (role === 'admin') {
    q = query(q, where('vendorId', '==', userId));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    callback(orders);
  });
};

export const listenToPastries = (vendorId, callback) => {
  let q = collection(db, 'pastries');
  
  if (vendorId) {
    q = query(q, where('vendorId', '==', vendorId));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const pastries = [];
    querySnapshot.forEach((doc) => {
      pastries.push({ id: doc.id, ...doc.data() });
    });
    callback(pastries);
  });
};

// INVENTORY MANAGEMENT
export const updateInventory = async (pastryId, quantity) => {
  try {
    const pastryRef = doc(db, 'pastries', pastryId);
    await updateDoc(pastryRef, {
      inventory: increment(-quantity),
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// FAVORITES
export const addToFavorites = async (userId, pastryId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: arrayUnion(pastryId),
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const removeFromFavorites = async (userId, pastryId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: arrayRemove(pastryId),
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};