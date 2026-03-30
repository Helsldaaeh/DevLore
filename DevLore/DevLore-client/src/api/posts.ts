import { apiClient } from './client';
import type { Post, RequestPost } from '../types';

export const getPosts = async (ids?: number[]): Promise<Post[]> => {
  const params = ids?.length ? { ids: ids.join(',') } : {};
  const response = await apiClient.get('/api/post', { params });
  return response.data;
};

export const searchPosts = async (query?: string, tag?: string, userId?: number): Promise<Post[]> => {
  const params: Record<string, string | number> = {};
  if (query) params.query = query;
  if (tag) params.tags = tag;      // теперь tags (множественное)
  if (userId) params.userId = userId;
  const response = await apiClient.get('/api/post/search', { params });
  return response.data;
};

export const createPost = async (post: RequestPost): Promise<void> => {
  await apiClient.post('/api/post', [post]);
};

export const updatePost = async (post: RequestPost): Promise<void> => {
  // отправляем PUT на /api/post/{id}
  await apiClient.put(`/api/post/${post.id}`, post);
};

export const deletePosts = async (ids: number[]): Promise<void> => {
  await apiClient.delete('/api/post', { data: ids });
};
export const getFeed = async (): Promise<Post[]> => {
  const response = await apiClient.get('/api/post/feed');
  return response.data;
};