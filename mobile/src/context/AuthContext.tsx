import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type AuthContextType = {
  userToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    // Load token from storage on mount
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) setUserToken(token);
      } catch (e) {
        console.error('Failed to load token', e);
      }
    };
    loadToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simple mock authentication – in real app call backend
    if (email && password) {
      const mockToken = 'mock-token-' + Date.now();
      await AsyncStorage.setItem('userToken', mockToken);
      setUserToken(mockToken);
    } else {
      Alert.alert('Login failed', 'Please provide email and password');
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};