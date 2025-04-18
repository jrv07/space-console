// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://127.0.0.1:8000',  
  withCredentials: true,             // 👈 send cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;