import { apiClient } from './client';
import type { Comment, RequestComment } from '../types';

export const getComments = async (ids?: number[]): Promise<Comment[]> => {
  const params = ids?.length ? { ids: ids.join(',') } : {};
  const response = await apiClient.get('/api/comment', { params });
  return response.data;
};

export const createComment = async (comment: RequestComment): Promise<void> => {
  await apiClient.post('/api/comment', [comment]);
};

export const updateComment = async (comment: RequestComment): Promise<void> => {
  await apiClient.post('/api/comment', [comment]);
};

export const deleteComments = async (ids: number[]): Promise<void> => {
  await apiClient.delete('/api/comment', { data: ids });
};