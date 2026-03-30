import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as followsApi from '../api/follows';
import type { User } from '../types';

interface FollowsState {
  followers: User[];
  following: User[];
  loading: boolean;
  error: string | null;
}

const initialState: FollowsState = {
  followers: [],
  following: [],
  loading: false,
  error: null,
};

export const fetchFollowers = createAsyncThunk(
  'follows/fetchFollowers',
  async (userId: number) => {
    const response = await followsApi.getFollowers(userId);
    return response;
  }
);

export const fetchFollowing = createAsyncThunk(
  'follows/fetchFollowing',
  async (userId: number) => {
    const response = await followsApi.getFollowing(userId);
    return response;
  }
);

export const followUser = createAsyncThunk(
  'follows/followUser',
  async (followedUserId: number, { dispatch }) => {
    await followsApi.follow(followedUserId);
    dispatch(fetchFollowing(followedUserId));
    return followedUserId;
  }
);

export const unfollowUser = createAsyncThunk(
  'follows/unfollowUser',
  async (followedUserId: number, { dispatch }) => {
    await followsApi.unfollow(followedUserId);
    dispatch(fetchFollowing(followedUserId));
    return followedUserId;
  }
);

const followsSlice = createSlice({
  name: 'follows',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch followers';
      })
      .addCase(fetchFollowing.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch following';
      });
  },
});

export default followsSlice.reducer;