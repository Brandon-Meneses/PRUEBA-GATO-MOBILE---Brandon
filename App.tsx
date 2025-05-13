import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import { initDatabase } from './src/database/database';
import AppNavigator from './src/navigation/AppNavigator';


export default function App() {
  useEffect(() => {
    initDatabase(); 
  }, []);

  return (
    <SafeAreaProvider>
    <AuthProvider>
      <AppNavigator />
      <Toast /> 
    </AuthProvider>
  </SafeAreaProvider>
  );
}