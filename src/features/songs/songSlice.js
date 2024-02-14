import { createSlice } from '@reduxjs/toolkit';
import { songList } from '../../../public/songList';

const initialState = {
  songs: [],
  isPlayingAll: false,
  currentSongIndex: -1,
  playNow: false,
  songId: 0,
};

initialState.songs = songList.map((songFile, index) => {
  const hyphenIndex = songFile.indexOf('-');
  if (hyphenIndex === -1) {
    throw new Error(`Invalid file name format: ${songFile}`);
  }
  
  const artistName = songFile.slice(0, hyphenIndex).trim();
  const songNameWithExtension = songFile.slice(hyphenIndex + 1);
  const songName = songNameWithExtension.slice(0, songNameWithExtension.lastIndexOf('.')).trim();
  const url = `/SongList/${songFile}`;

  return {
    id: index,
    songName,
    artistName,
    url,
    trackNumber: index + 1,
    added: false,
  };
});

const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    addSong(state, action) {
      state.songs.push(action.payload);
    },
    playAll(state) {
      state.isPlayingAll = true;
      state.currentSongIndex = 0;
    },
    addAll(state) {
      state.isPlayingAll = true;
    },
    stopAll(state) {
      state.isPlayingAll = false;
      state.currentSongIndex = -1;
    },
    checkSong(state, action) {
      const startIndex = action.payload;
      for (let i = startIndex; i < state.songs.length; i++) {
        state.songs[i].added = true;
      }
      state.currentSongIndex = startIndex;
    },
    unCheckSong(state) {
      for (let i = 0; i < state.songs.length; i++) {
        state.songs[i].added = false;
      }
    },
    setCurrentSongIndex(state, action) {
      state.currentSongIndex = action.payload;
    },
    reorderSongs(state, action) {
      const { startIndex, endIndex } = action.payload;
      const [removedSong] = state.songs.splice(startIndex, 1);
      state.songs.splice(endIndex, 0, removedSong);
      if (state.currentSongIndex === startIndex) {
        state.currentSongIndex = endIndex;
      } else if (startIndex < state.currentSongIndex && endIndex >= state.currentSongIndex) {
        state.currentSongIndex -= 1;
      } else if (startIndex > state.currentSongIndex && endIndex <= state.currentSongIndex) {
        state.currentSongIndex += 1;
      }
    },
    updateSongs(state, action) {
      state.songs = action.payload;
    },
  },
});

export const { 
  addSong, 
  playAll, 
  addAll, 
  stopAll, 
  setCurrentSongIndex, 
  reorderSongs, 
  updateSongs, 
  checkSong, 
  unCheckSong } = songSlice.actions;

export default songSlice.reducer;
