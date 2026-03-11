// src/api/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Ajuste conforme backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;