import axios from 'axios';

// 1. Define a URL base da nossa API backend
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// 2. O Interceptor (O "Segurança" Automático)
api.interceptors.request.use(
  (config) => {
    // 3. Pega o token DIRETAMENTE do localStorage
    const token = localStorage.getItem('jwtToken');
    
    // 4. Se o token existir, anexa ele em todas as requisições
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;