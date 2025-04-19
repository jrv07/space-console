// src/api/axiosInstance.js
import axios from 'axios';
import { FASTAPI_BASE_URL } from '../config';

const axiosInstance = axios.create({
  baseURL: `${FASTAPI_BASE_URL}`,     // FastAPI server
  withCredentials: true,             // send cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;