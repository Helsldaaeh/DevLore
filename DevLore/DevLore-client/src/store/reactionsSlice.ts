import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Reaction, RequestReaction } from '../types';
import * as reactionsApi from '../api/reactions';
import type { RootState } from './store';

interface ReactionsState {
  items: Reaction[];
  loading: boolean;
  error: string | null;
}

const initialState: ReactionsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchReactions = createAsyncThunk(
  'reactions/fetchReactions',
  async (ids?: number[]) => {
    const response = await reactionsApi.getReactions(ids);
    return response;
  }
);

export const toggleReaction = createAsyncThunk(
  'reactions/toggleReaction',
  async (reaction: RequestReaction, { dispatch, getState }) => {
    const state = getState() as RootState;
    const existing = state.reactions.items.find(
      r => r.userId === reaction.userId &&
           (reaction.postId !== undefined ? r.postId === reaction.postId : r.commentId === reaction.commentId)
    );

    // Если существует и тип совпадает – удаляем
    if (existing && existing.type === reaction.type) {
      await reactionsApi.deleteReactions([existing.id!]);
    } 
    // Если существует, но тип другой – удаляем старую и добавляем новую
    else if (existing && existing.type !== reaction.type) {
      await reactionsApi.deleteReactions([existing.id!]);
      await reactionsApi.createReaction(reaction);
    }
    // Если не существует – добавляем
    else {
      await reactionsApi.createReaction(reaction);
    }

    dispatch(fetchReactions());
    return reaction;
  }
);

export const addReaction = createAsyncThunk(
  'reactions/addReaction',
  async (reaction: RequestReaction, { dispatch }) => {
    await reactionsApi.createReaction(reaction);
    dispatch(fetchReactions());
    return reaction;
  }
);

export const deleteReaction = createAsyncThunk(
  'reactions/deleteReaction',
  async (ids: number[], { dispatch }) => {
    await reactionsApi.deleteReactions(ids);
    dispatch(fetchReactions());
    return ids;
  }
);

const reactionsSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reactions';
      });
  },
});

export default reactionsSlice.reducer;