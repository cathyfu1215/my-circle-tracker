import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Default context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Storage key for persisting user data
const USER_STORAGE_KEY = '@circle_tracker:user';

interface StoredUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  lastLoginAt: number;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to store user data
  const storeUserData = async (firebaseUser: User | null) => {
    try {
      if (firebaseUser) {
        // Store minimal user data - avoid circular references
        const userData: StoredUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          lastLoginAt: Date.now()
        };
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  // Load initial user state
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // First, try to load user from AsyncStorage for a quick start
        const storedUserJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
        let initialUser = null;
        
        if (storedUserJson) {
          try {
            // This is just for temporary display until Firebase auth state loads
            console.log('Found stored user data, displaying temporarily');
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
          }
        }
        
        // Now, listen for Firebase auth state changes which will provide the actual user
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
          
          // Store user data if logged in, remove if logged out
          await storeUserData(firebaseUser);
          
          setUser(firebaseUser);
          setLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error in auth state loading:', error);
        setLoading(false);
        return () => {};
      }
    };
    
    loadUserData();
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // The auth state listener will handle updating the user state
      await storeUserData(userCredential.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register with email and password
  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // The auth state listener will handle updating the user state
      await storeUserData(userCredential.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 