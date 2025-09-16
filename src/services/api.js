import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://172.17.17.25:8080/api/food';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getFoodItems = () => {
  return api.get('/food/available');
};

export const getOrders = () => {
  return api.get('/orders/user');
};

export const addToCart = (itemId, quantity) => {
  return api.post('/cart', { itemId, quantity });
};

export const getCart = () => {
  return api.get('/cart');
};

export const placeOrder = () => {
  return api.post('/orders');
};

export default api;