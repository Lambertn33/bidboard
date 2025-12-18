import axios from 'axios';
import { API_BASE_URL } from '../constants';

export interface RegisterDto {
  names: string;
  email: string;
  password: string;
  telephone: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
});

export const register = async (data: RegisterDto) => {
  const response = await authApi.post('/register', data);
  return response.data;
};

export const login = async (data: LoginDto) => {
  const response = await authApi.post('/login', data);
  return response.data;
};

export const logout = async (sessionId: string) => {
  const response = await authApi.post('/logout', { sessionId });
  return response.data;
};