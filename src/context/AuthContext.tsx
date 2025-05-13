import * as SecureStore from 'expo-secure-store';
import React, { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

type AuthContextType = {
  token: string | null;
  email: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  email: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedEmail = await SecureStore.getItemAsync('userEmail');
        if (storedToken) setToken(storedToken);
        if (storedEmail) setEmail(storedEmail);
      } catch (error) {
        console.error('Error al cargar sesión:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = async (newToken: string, userEmail: string) => {
    try {
      await SecureStore.setItemAsync('userToken', newToken);
      await SecureStore.setItemAsync('userEmail', userEmail);
      setToken(newToken);
      setEmail(userEmail);
    } catch (error) {
      console.error('Error al guardar sesión:', error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userEmail');
      setToken(null);
      setEmail(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5E17EB" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ token, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};