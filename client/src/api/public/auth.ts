import axios from 'axios';

export interface RegisterDto {
  names: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const authApi = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
});

export const register = async (data: RegisterDto) => {
  const response = await authApi.post('/register', data);
  return response.data;
};

export const login = async (data: LoginDto) => {
  const response = await authApi.post('/login', data);
  return response.data;
};