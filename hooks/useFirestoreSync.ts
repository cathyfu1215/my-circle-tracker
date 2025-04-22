import { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTaskStore } from '../store/taskStore';

/**
 * Hook to synchronize data between local storage and Firestore
 * Automatically syncs when auth state changes or when the component mounts
 */
export const useFirestoreSync = () => {
  const { user } = useAuth();
  const { 
    syncWithFirebase, 
    loadFromStorage, 
    isLoading, 
    isSynced 
  } = useTaskStore();
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  // Initial load from AsyncStorage
  useEffect(() => {
    const initialLoad = async () => {
      await loadFromStorage();
      setInitialLoadDone(true);
    };
    
    initialLoad();
  }, [loadFromStorage]);
  
  // Sync with Firestore when auth state changes or on component mount
  useEffect(() => {
    if (initialLoadDone) {
      syncWithFirebase(user);
    }
  }, [user, syncWithFirebase, initialLoadDone]);
  
  return {
    isLoading,
    isSynced,
    syncNow: () => syncWithFirebase(user) // Manual sync function
  };
}; 