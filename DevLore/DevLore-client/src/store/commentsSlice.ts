import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Comment, RequestComment } from '../types';
import * as commentsApi from '../api/comment';
import type { RootState } from './store';

interface CommentsState {
  items: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (ids?: number[]) => {
    const response = await commentsApi.getComments(ids);
    return response;
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async (comment: RequestComment, { dispatch, getState }) => {
    const state = getState() as RootState;
    const currentUser = state.auth.user;
    await commentsApi.createComment(comment);
    dispatch(fetchComments());
    return {
      ...comment,
      username: currentUser?.username || 'Unknown',
      createdAt: new Date().toISOString(),
    } as Comment;
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async (comment: RequestComment, { dispatch }) => {
    await commentsApi.updateComment(comment);
    dispatch(fetchComments());
    return comment;
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (ids: number[], { dispatch }) => {
    await commentsApi.deleteComments(ids);
    dispatch(fetchComments());
    return ids;
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      });
  },
});

export default commentsSlice.reducer;