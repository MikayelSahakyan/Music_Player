import { configureStore } from '@reduxjs/toolkit';
import songSlice from '../features/songs/songSlice';

export default configureStore({
  reducer: {
    songs: songSlice,
  },
});