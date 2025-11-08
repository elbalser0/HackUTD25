// Firebase configuration with fallback to mock for development
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Check if we should use mock Firebase (for development without real keys)
const useMockAuth = process.env.EXPO_PUBLIC_USE_MOCK_AUTH === 'true' || 
                   !process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
                   process.env.EXPO_PUBLIC_FIREBASE_API_KEY === 'your_firebase_api_key_here';

let app, auth, db;

if (useMockAuth) {
  console.log('🔧 Using mock Firebase for development');
  
  // Mock Firebase app object
  app = {
    name: 'mock-firebase-app',
    options: {
      projectId: 'pnc-productivity-demo'
    }
  };

  // Mock auth object
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Return unsubscribe function
      return () => {};
    }
  };

  // Mock Firestore object
  db = {
    collection: (path) => ({
      doc: () => ({
        set: () => Promise.resolve(),
        get: () => Promise.resolve({ exists: false, data: () => null }),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve()
      }),
      add: () => Promise.resolve({ id: 'mock-id' }),
      get: () => Promise.resolve({ docs: [] })
    })
  };
} else {
  console.log('🔥 Using real Firebase configuration');
  
  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };

  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Firebase Auth with AsyncStorage persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  // Initialize Cloud Firestore
  db = getFirestore(app);
}

export { app, auth, db };
export default app;