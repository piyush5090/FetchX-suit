import { configureStore } from '@reduxjs/toolkit';
import mediaReducer from '../features/media/mediaSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    auth: authReducer,
  },
});
