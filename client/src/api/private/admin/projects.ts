import protectedApi from '../axios';
import { handleAxiosError } from '../utils';

export const createProject = async (payload: { name: string; description: string }) => {
  try {
    const response = await protectedApi.post('/projects', payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to create project. Please try again.');
  }
};