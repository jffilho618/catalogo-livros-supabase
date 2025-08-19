import axios from 'axios';

// Cria uma instância do Axios com a URL base do nosso back-end
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // A URL do nosso servidor Node.js
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação em todas as chamadas
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;