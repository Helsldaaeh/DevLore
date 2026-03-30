import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import commentsReducer from './commentsSlice';
import reactionsReducer from './reactionsSlice';
import authReducer from './authSlice';
import usersReducer from './usersSlice';
import followsReducer from './followSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    reactions: reactionsReducer,
    auth: authReducer,
    follows: followsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;