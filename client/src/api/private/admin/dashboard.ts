import { handleAxiosError } from '../utils';
import protectedApi from '../axios';

export const getDashboardOverview = async () => {
  try {
    const response = await protectedApi.get('/admin/dashboard/overview');
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch dashboard overview');
  }
};

export const getRecentTasks = async () => {
  try {
    const response = await protectedApi.get('/admin/dashboard/recent-tasks');
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch recent tasks');
  }
};

export const getRecentBids = async () => {
  try {
    const response = await protectedApi.get('/admin/dashboard/recent-bids');
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch recent bids');
  }
};

export const getRecentWorks = async () => {
  try {
    const response = await protectedApi.get('/admin/dashboard/recent-works');
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch recent works');
  }
};
