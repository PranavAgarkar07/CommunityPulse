/**
 * Firebase configuration & service initialisation
 * Project: communitypulse-a9ecc
 */
import { initializeApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  getFirestore,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey:            "AIzaSyC2qQsNXVWCrqLiY_SvOSOcM-5pcmlSgHQ",
  authDomain:        "communitypulse-a9ecc.firebaseapp.com",
  projectId:         "communitypulse-a9ecc",
  storageBucket:     "communitypulse-a9ecc.firebasestorage.app",
  messagingSenderId: "449254913174",
  appId:             "1:449254913174:web:14c30056b74e3089f1feb7",
  measurementId:     "G-8BC6D01BB0",
};

// Prevent duplicate initialisation on hot-reload
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Auth — persisted across app restarts via AsyncStorage
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

// Firestore — offline persistence on native only (web doesn't support IndexedDB reliably)
let db;
try {
  if (Platform.OS !== 'web') {
    db = initializeFirestore(app, { localCache: persistentLocalCache() });
  } else {
    db = getFirestore(app); // memory cache for web preview
  }
} catch {
  db = getFirestore(app);
}

// Cloud Storage
const storage = getStorage(app);

export { app, auth, db, storage };
