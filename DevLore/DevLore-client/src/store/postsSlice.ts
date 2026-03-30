import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Post, RequestPost } from '../types';
import * as postsApi from '../api/posts';

interface PostsState {
  items: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (ids?: number[]) => {
    const response = await postsApi.getPosts(ids);
    return response;
  }
);

export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async ({ query, tag, userId }: { query?: string; tag?: string; userId?: number }) => {
    const response = await postsApi.searchPosts(query, tag, userId);
    return response;
  }
);

export const addPost = createAsyncThunk(
  'posts/addPost',
  async (post: RequestPost, { dispatch }) => {
    await postsApi.createPost(post);
    dispatch(fetchPosts());
    return post;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (post: RequestPost, { dispatch }) => {
    await postsApi.updatePost(post);
    dispatch(fetchPosts());
    return post;
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (ids: number[], { dispatch }) => {
    await postsApi.deletePosts(ids);
    dispatch(fetchPosts());
    return ids;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      })
      .addCase(deletePost.fulfilled, () => {
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;