import axios from 'axios';

const rawURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api';
const baseURL = rawURL.endsWith('/api') ? rawURL : `${rawURL}/api`;

export default axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});
