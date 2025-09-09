import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.error || data?.message || `HTTP Error ${status}`;
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Нет ответа от сервера. Проверьте подключение к интернету.');
    } else {
      // Something else happened
      throw new Error(error.message || 'Произошла неизвестная ошибка');
    }
  }
);

// Analytics API
export const analyticsApi = {
  // Get analytics data
  getData: () => api.get('/analytics/data'),
  
  // Get warehouse distribution data
  getWarehouseDistribution: () => api.get('/analytics/warehouse-distribution'),
  
  // Get analytics summary
  getSummary: () => api.get('/analytics/summary'),
  
  // Get critical products
  getCriticalProducts: () => api.get('/analytics/critical-products'),
};

// Packaging API
export const packagingApi = {
  // Get packed goods data
  getPackedGoods: () => api.get('/packaging/packed-goods'),
  
  // Get preparation list
  getPreparationList: (priority = '14') => 
    api.get(`/packaging/preparation-list?priority=${priority}`),
  
  // Get packaging summary
  getSummary: () => api.get('/packaging/summary'),
};

// Supply API
export const supplyApi = {
  // Generate automatic supply plan
  generateAutoSupply: (params) => 
    api.post('/supply/generate-auto-supply', params),
  
  // Get formed supplies
  getFormedSupplies: () => api.get('/supply/formed-supplies'),
  
  // Get supply details
  getSupplyDetails: (id) => api.get(`/supply/supply-details/${id}`),
  
  // Get warehouse capacities
  getWarehouseCapacities: () => api.get('/supply/warehouse-capacities'),
};

// Health check
export const healthApi = {
  check: () => api.get('/health'),
};

export default api;