// utils/api.ts
import axios from 'axios';

// utils/api.ts (o donde tengas tu instancia de Axios)
const api = axios.create({
  baseURL: 'http://192.168.0.20:8000', // <-- tu nueva IP
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
