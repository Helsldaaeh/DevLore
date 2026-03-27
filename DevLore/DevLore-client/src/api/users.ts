import { apiClient } from './client';
import type { User, RequestUser } from '../types';

export const getUsers = async (ids?: number[]): Promise<User[]> => {
  const params = ids?.length ? { ids: ids.join(',') } : {};
  const response = await apiClient.get('/api/user', { params });
  return response.data;
};

export const createUser = async (user: RequestUser): Promise<void> => {
  await apiClient.post('/api/user', [user]);
};

export const updateUser = async (user: RequestUser): Promise<void> => {
  await apiClient.post('/api/user', [user]);
};

export const deleteUsers = async (ids: number[]): Promise<void> => {
  await apiClient.delete('/api/user', { data: ids });
};
