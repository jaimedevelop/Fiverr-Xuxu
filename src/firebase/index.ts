// src/firebase/index.ts
// Main Firebase exports for easy importing
export { auth, db, storage, functions } from './config';
// Auth functions
export {
  registerUser,
  signInUser,
  signOutUser,
  resetPassword,
  getUserProfile,
  onAuthStateChange
} from './auth';
// Database functions
export {
  addPastry,
  getPastries,
  updatePastry,
  deletePastry,
  createOrder,
  getOrders,
  updateOrderStatus,
  listenToOrders,
  listenToPastries,
  updateInventory,
  addToFavorites,
  removeFromFavorites
} from './database';
// Storage functions
export {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  listFiles,
  generateFilePath,
  uploadPastryImage,
  uploadProfilePicture
} from './storage';