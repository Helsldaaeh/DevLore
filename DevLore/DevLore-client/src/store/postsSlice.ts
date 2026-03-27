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

export const addPost = createAsyncThunk(
  'posts/addPost',
  async (post: RequestPost, { dispatch }) => {
    await postsApi.createPost(post);
    // После успешного создания перезагружаем список постов
    dispatch(fetchPosts());
    return post;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (post: RequestPost) => {
    await postsApi.updatePost(post);
    return post;
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (ids: number[]) => {
    await postsApi.deletePosts(ids);
    return ids;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
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
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => !action.payload.includes(post.id!));
      });
  },
});

export default postsSlice.reducer;