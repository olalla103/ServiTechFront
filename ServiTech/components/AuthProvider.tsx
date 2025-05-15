import {
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../utils/firebase';

// Definimos el tipo de los valores que proporcionará el contexto
type AuthContextType = {
  user: FirebaseUser | null;
  role: 'cliente' | 'tecnico' | null;
  loading: boolean;
  login: (idToken: string, role: 'cliente' | 'tecnico') => Promise<void>;
  loginWithEmail: (email: string, pass: string, role: 'cliente' | 'tecnico') => Promise<void>;
  registerWithEmail: (data: {
    email: string;
    pass: string;
    name: string;
    role: 'cliente' | 'tecnico';
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  login: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
});

// Definimos las props del proveedor para incluir children
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<'cliente' | 'tecnico' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      const storedRole = await fetchUserRole(fbUser?.uid || '');
      setRole(storedRole);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (
    idToken: string,
    selectedRole: 'cliente' | 'tecnico'
  ) => {
    await fetch('https://tu-api.com/auth/validate-token', {
      method: 'POST',
      headers: { Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ role: selectedRole }),
    });
    setRole(selectedRole);
  };

  const loginWithEmail = async (
    email: string,
    pass: string,
    selectedRole: 'cliente' | 'tecnico'
  ) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const idToken = await cred.user.getIdToken();
    await login(idToken, selectedRole);
  };

  const registerWithEmail = async ({
    email,
    pass,
    name,
    role: selectedRole,
  }: {
    email: string;
    pass: string;
    name: string;
    role: 'cliente' | 'tecnico';
  }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await fetch('https://tu-api.com/auth/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${await cred.user.getIdToken()}` },
      body: JSON.stringify({ name, role: selectedRole }),
    });
    const idToken = await cred.user.getIdToken();
    await login(idToken, selectedRole);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        loginWithEmail,
        registerWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Función auxiliar para obtener el rol (puede venir de AsyncStorage o Firestore)
async function fetchUserRole(
  uid: string
): Promise<'cliente' | 'tecnico' | null> {
  // Aquí cargas el rol guardado (o lo dejas null si no existe)
  return null;
}
