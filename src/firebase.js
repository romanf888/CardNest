import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  collection, 
  setDoc as setDocFs 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Use the dedicated database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Known admin email from applet environment
export const ADMIN_EMAIL = 'romanferriere4@gmail.com';

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign Out Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save user collection to Firestore cloud
 */
export async function saveUserCollectionToCloud(userId, collectionData) {
  if (!userId || !db) return;
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      collection: collectionData,
      lastSyncedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving collection to Firestore:', error);
  }
}

/**
 * Subscribe to real-time user collection updates
 */
export function subscribeToUserCloudCollection(userId, onUpdate) {
  if (!userId || !db) return () => {};

  const userDocRef = doc(db, 'users', userId);
  const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.collection)) {
        onUpdate(data.collection);
      }
    }
  }, (err) => {
    console.warn('Firestore user collection subscription warning:', err);
  });

  return unsubscribe;
}
