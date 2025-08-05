declare module '../firebase/config.js' {
  import { Firestore } from 'firebase/firestore';
  
  const db: Firestore;
  const auth: any;
  const storage: any;
  const functions: any;
  
  export { db, auth, storage, functions };
  export default db;
}