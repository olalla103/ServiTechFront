// utils/api.ts
import axios from 'axios';

// utils/api.ts (o donde tengas tu instancia de Axios)
const api = axios.create({
  baseURL: 'https://servitechapi.fly.dev',// <-- Casa Villanueva
//  baseURL: 'http://192.168.0.16:7999',// <-- Casa Villanueva
  //baseURL:'http://192.168.1.73:8000', // <-- Casa Guille
//baseURL:'http://172.20.10.2:7999',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
