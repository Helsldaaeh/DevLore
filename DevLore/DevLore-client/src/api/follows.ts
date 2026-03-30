import { apiClient } from './client';
import type { Follow, User } from '../types';

export const getFollows = async (): Promise<Follow[]> => {
  const response = await apiClient.get('/api/follow');
  return response.data;
};

export const follow = async (followedUserId: number): Promise<void> => {
  await apiClient.post('/api/follow', { followedUserId });
};

export const unfollow = async (followedUserId: number): Promise<void> => {
  await apiClient.delete(`/api/follow/${followedUserId}`);
};

export const getFollowers = async (userId: number): Promise<User[]> => {
  const response = await apiClient.get(`/api/user/${userId}/followers`);
  return response.data;
};

export const getFollowing = async (userId: number): Promise<User[]> => {
  const response = await apiClient.get(`/api/user/${userId}/following`);
  return response.data;
};