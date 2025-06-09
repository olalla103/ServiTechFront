// utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000 ',   // pon aquí la URL de tu backend
  timeout: 5000,                    // tiempo máximo de espera
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
