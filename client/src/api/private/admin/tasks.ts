import protectedApi from '../axios';
import { handleAxiosError } from '../utils';

interface ICreateTaskPayload {
  name: string;
  description: string;
  project_id: string | null;
  price: number;
  skills: string[];
}

interface IUpdateTaskPayload {
  name: string;
  description: string;
  price: number;
  skills: string[];
}

export const createTask = async (payload: ICreateTaskPayload) => {
  try {
    const response = await protectedApi.post('/tasks', payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to create task. Please try again.');
  }
};

export const updateTask = async (taskId: string, payload: IUpdateTaskPayload) => {
  try {
    const response = await protectedApi.put(`/tasks/${taskId}`, payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to edit task. Please try again.');
  }
};