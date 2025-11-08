import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Mock authentication - check if user was previously logged in
    const checkAuthState = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('@user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log('Error reading auth state:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuthState();
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    // Mock authentication
    const mockUser = {
      uid: 'demo-user-' + Date.now(),
      email: email,
      displayName: email.split('@')[0],
      photoURL: null,
    };
    
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    } catch (error) {
      throw new Error('Mock login failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
    } catch (error) {
      console.log('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (email, password) => {
    // Mock user creation
    return await signIn(email, password);
  };

  const value = {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
    signIn,
    signOut,
    createUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};