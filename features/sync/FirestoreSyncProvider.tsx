import React, { ReactNode, createContext, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useFirestoreSync } from '../../hooks/useFirestoreSync';
import { THEME_COLORS } from '../../constants/colors';

interface FirestoreSyncContextType {
  isLoading: boolean;
  isSynced: boolean;
  syncNow: () => Promise<void>;
}

const FirestoreSyncContext = createContext<FirestoreSyncContextType>({
  isLoading: false,
  isSynced: false,
  syncNow: async () => {}
});

export const useFirestoreSyncContext = () => useContext(FirestoreSyncContext);

interface FirestoreSyncProviderProps {
  children: ReactNode;
  showLoadingIndicator?: boolean;
}

export const FirestoreSyncProvider: React.FC<FirestoreSyncProviderProps> = ({ 
  children, 
  showLoadingIndicator = true 
}) => {
  const { isLoading, isSynced, syncNow } = useFirestoreSync();
  
  // Show loading indicator during initial sync
  if (isLoading && showLoadingIndicator) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={THEME_COLORS.primary} size="large" />
      </View>
    );
  }
  
  return (
    <FirestoreSyncContext.Provider value={{ isLoading, isSynced, syncNow }}>
      {children}
    </FirestoreSyncContext.Provider>
  );
}; 