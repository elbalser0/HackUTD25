// Firebase Auth functions with fallback to mock
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './config';

// Check if we're using mock auth
const useMockAuth = process.env.EXPO_PUBLIC_USE_MOCK_AUTH === 'true' || 
                   !process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
                   process.env.EXPO_PUBLIC_FIREBASE_API_KEY === 'your_firebase_api_key_here';

export const createUser = async (email, password) => {
  if (useMockAuth) {
    // Mock user creation
    return {
      uid: 'mock-uid-' + Date.now(),
      email: email,
      displayName: email.split('@')[0]
    };
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  if (useMockAuth) {
    // Mock sign in
    return {
      uid: 'mock-uid-' + Date.now(),
      email: email,
      displayName: email.split('@')[0]
    };
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  if (useMockAuth) {
    // Mock sign out
    return Promise.resolve();
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  if (useMockAuth) {
    return null;
  }
  return auth.currentUser;
};

export const onAuthStateChange = (callback) => {
  if (useMockAuth) {
    // Mock auth state listener
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};