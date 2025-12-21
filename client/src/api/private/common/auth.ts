import { protectedApi } from '../axios';

export interface ProfileResponse {
  id: string;
  email: string;
  role: 'ADMIN' | 'FREELANCER';
  names: string;
  telephone?: string;
  balance?: number;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await protectedApi.get('/auth/me');
  return response.data;
};

