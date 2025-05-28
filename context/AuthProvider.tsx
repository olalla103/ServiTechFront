import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { verificarCredenciales } from '../utils/handler_usuarios'; // Ajusta la ruta

type AuthContextType = {
  user: any;
  token: string | null;
  loading: boolean;
  login: (email: string, contraseña: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ESTE ES EL HOOK QUE DEBES EXPORTAR Y USAR EN TUS COMPONENTES
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const storedToken = await SecureStore.getItemAsync('token');
      const storedUser = await SecureStore.getItemAsync('user');
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    };
    loadSession();
  }, []);

  const login = async (email: string, contraseña: string) => {
    setLoading(true);
    try {
      const res = await verificarCredenciales(email, contraseña);
      if (res.access_token) {
        await SecureStore.setItemAsync('token', res.access_token);
        setToken(res.access_token);
        if (res.user) {
          await SecureStore.setItemAsync('user', JSON.stringify(res.user));
          setUser(res.user);
        } else {
          setUser(null);
        }
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (e: any) {
      setToken(null);
      setUser(null);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
