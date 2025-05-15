// utils/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase (la del Dashboard)
const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_AUTH_DOMAIN',
  projectId: 'TU_PROJECT_ID',
  storageBucket: 'TU_STORAGE_BUCKET',
  messagingSenderId: 'TU_MESSAGING_SENDER_ID',
  appId: 'TU_APP_ID',
};

// Inicializas la App
const app = initializeApp(firebaseConfig);

// En lugar de initializeAuth, simplemente getAuth():
export const auth = getAuth(app);
