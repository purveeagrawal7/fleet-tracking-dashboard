import axios from 'axios';

const BASE_URL = 'https://case-study-26cf.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const fetchVehicles = async () => {
  const response = await apiClient.get('/api/vehicles');
  return response.data;
};

export const fetchVehicleById = async (id) => {
  const response = await apiClient.get(`/api/vehicles/${id}`);
  return response.data;
};

export const fetchVehiclesByStatus = async (status) => {
  const response = await apiClient.get(`/api/vehicles/status/${status}`);
  return response.data;
};

export const fetchStatistics = async () => {
  const response = await apiClient.get('/api/statistics');
  return response.data;
};
