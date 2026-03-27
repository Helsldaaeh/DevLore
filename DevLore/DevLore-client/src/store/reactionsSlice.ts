import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Reaction, RequestReaction } from '../types';
import * as reactionsApi from '../api/reactions';

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

export const addReaction = createAsyncThunk(
  'reactions/addReaction',
  async (reaction: RequestReaction, { dispatch }) => {
    await reactionsApi.createReaction(reaction);
    // После добавления реакции обновляем список
    dispatch(fetchReactions());
    return reaction;
  }
);

export const deleteReaction = createAsyncThunk(
  'reactions/deleteReaction',
  async (ids: number[]) => {
    await reactionsApi.deleteReactions(ids);
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
      })
      .addCase(deleteReaction.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => !action.payload.includes(r.id!));
      });
  },
});

export default reactionsSlice.reducer;