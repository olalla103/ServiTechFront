// utils/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = { /* tu configuración */ };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
