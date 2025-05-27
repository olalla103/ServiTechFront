import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { verificarCredenciales } from '../utils/handler_usuarios'; // Ajusta la ruta si es necesario

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Leer token y usuario al arrancar la app
  useEffect(() => {
    const loadSession = async () => {
      const storedToken = await SecureStore.getItemAsync('token');
      const storedUser = await SecureStore.getItemAsync('user');
      console.log('CARGANDO TOKEN DE SECURESTORE:', storedToken);
      console.log('CARGANDO USER DE SECURESTORE:', storedUser);
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    };
    loadSession();
  }, []);

  // Login: pide el token y guarda usuario/token en SecureStore
  const login = async (email: string, contraseña: string) => {
    setLoading(true);
    try {
      const res = await verificarCredenciales(email, contraseña);
      console.log("RESPUESTA DEL LOGIN:", res);
      if (res.access_token) {
        await SecureStore.setItemAsync('token', res.access_token);
        setToken(res.access_token);

        if (res.user) {
          console.log('GUARDANDO USER EN SECURESTORE:', res.user);
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

  // Logout: borra token y usuario del almacenamiento seguro
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
