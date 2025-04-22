import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';
import { AuthProvider } from './features/auth/AuthContext';
import { FirestoreSyncProvider } from './features/sync/FirestoreSyncProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FirestoreSyncProvider>
          <Navigation />
          <StatusBar />
        </FirestoreSyncProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
} 