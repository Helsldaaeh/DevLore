import { apiClient } from './client';
import type { Post, RequestPost } from '../types';

export const getPosts = async (ids?: number[]): Promise<Post[]> => {
  const params = ids?.length ? { ids: ids.join(',') } : {};
  const response = await apiClient.get('/api/post', { params });
  return response.data;
};

export const createPost = async (post: RequestPost): Promise<void> => {
  await apiClient.post('/api/post', [post]);
};

export const updatePost = async (post: RequestPost): Promise<void> => {
  await apiClient.post('/api/post', [post]);
};

export const deletePosts = async (ids: number[]): Promise<void> => {
  await apiClient.delete('/api/post', { data: ids });
};