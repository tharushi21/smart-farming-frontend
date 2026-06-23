import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://smart-farming-frontend-ji2k-oyq9ilq9a.vercel.app/login',
});