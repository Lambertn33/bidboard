import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants';
import { jwtDecode } from 'jwt-decode';

// Create a protected axios instance
export const protectedApi = axios.create({
  baseURL: API_BASE_URL,
});

interface JwtPayload {
  exp?: number;
  iat?: number;
}

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) {
      return true;
    }
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    return currentTime >= expirationTime - 60000;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return true;
  }
};

const handleTokenExpiration = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

protectedApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      if (isTokenExpired(token)) {
        handleTokenExpiration();
        
        return Promise.reject(new Error('Token expired. Please login again.'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

protectedApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      handleTokenExpiration();
    }
    
    return Promise.reject(error);
  }
);

export default protectedApi;

