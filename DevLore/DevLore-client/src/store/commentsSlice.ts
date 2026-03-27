import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Comment, RequestComment } from '../types';
import * as commentsApi from '../api/comment';

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
  async (comment: RequestComment) => {
    await commentsApi.createComment(comment);
    return comment;
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (ids: number[]) => {
    await commentsApi.deleteComments(ids);
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
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => !action.payload.includes(c.id!));
      });
  },
});

export default commentsSlice.reducer;