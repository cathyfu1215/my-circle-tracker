import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID
} from '@env';

// Hardcoded projectId as fallback (replace with your actual project ID from the env check)
const FALLBACK_PROJECT_ID = 'my-circle-tracker-c7cbe';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID || FALLBACK_PROJECT_ID, // Use fallback if not in env
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

// Add diagnostic logging
console.log('Firebase configuration check:');
console.log('API Key defined:', !!FIREBASE_API_KEY);
console.log('Project ID in use:', firebaseConfig.projectId);
console.log('Auth Domain:', FIREBASE_AUTH_DOMAIN || 'MISSING');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with React Native optimizations
export const firestore = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // This helps with React Native connectivity
});

console.log('Firestore initialized with app config:', app.options.projectId);

export default app; 