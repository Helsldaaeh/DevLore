import { apiClient } from './client';
import type { Reaction, RequestReaction } from '../types';

export const getReactions = async (ids?: number[]): Promise<Reaction[]> => {
  const params = ids?.length ? { ids: ids.join(',') } : {};
  const response = await apiClient.get('/api/reaction', { params });
  return response.data;
};

export const createReaction = async (reaction: RequestReaction): Promise<void> => {
  await apiClient.post('/api/reaction', [reaction]);
};

export const deleteReactions = async (ids: number[]): Promise<void> => {
  await apiClient.delete('/api/reaction', { data: ids });
};