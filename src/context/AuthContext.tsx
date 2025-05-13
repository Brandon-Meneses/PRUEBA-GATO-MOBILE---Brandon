import * as SecureStore from 'expo-secure-store';
import React, { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getUserByEmail } from '../database/dbService';

type AuthContextType = {
  token: string | null;
  email: string | null;
  userInfo?: {
    id: number;
    name: string;
    avatar: string;
  };
  login: (token: string, email: string, userInfo?: AuthContextType['userInfo']) => void;
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
  const [userInfo, setUserInfo] = useState<AuthContextType['userInfo']>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedEmail = await SecureStore.getItemAsync('userEmail');
  
        if (storedToken && storedEmail) {
          setToken(storedToken);
          setEmail(storedEmail);
          const user = await getUserByEmail(storedEmail);
          if (user) {
            setUserInfo({
              id: user.id!,
              name: user.name,
              avatar: user.avatar || '',
            });
          }
        }
      } catch (err) {
        console.error('Error cargando sesión:', err);
      } finally {
        setLoading(false); 
      }
    };
  
    loadSession();
  }, []);

  const login = async (
      newToken: string,
      userEmail: string,
      userInfo?: AuthContextType['userInfo']
    ) => {
      await SecureStore.setItemAsync('userToken', newToken);
      await SecureStore.setItemAsync('userEmail', userEmail);
      setToken(newToken);
      setEmail(userEmail);
      setUserInfo(userInfo);
    };

    const logout = async () => {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userEmail');
      setToken(null);
      setEmail(null);
      setUserInfo(undefined);
    };

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#5E17EB" />
        </View>
      );
    }

  return (
    <AuthContext.Provider value={{ token, email, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};