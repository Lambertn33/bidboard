import axios from 'axios';
import { getAuthHeaders, handleAxiosError } from '../utils';

import { API_BASE_URL } from '../../constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/admin/dashboard`,
});

export const getDashboardOverview = async () => {
  try {
    const response = await api.get('/overview', {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch dashboard overview');
  }
};

export const getRecentTasks = async () => {
  try {
    const response = await api.get('/recent-tasks', {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch recent tasks');
  }
};

export const getRecentBids = async () => {
  try {
    const response = await api.get('/recent-bids', {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch recent bids');
  }
};

export const getRecentWorks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard/recent-works`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch recent works');
  }
};