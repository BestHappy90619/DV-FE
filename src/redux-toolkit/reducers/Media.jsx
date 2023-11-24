import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showMedia: true,
  mediaSide: true, //true: left, false: right
  isPlaying: false,
  autoPlay: false,
  currentTime: 0,  // unit is 'second'
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setShowMedia: (state, action) => {
      return { ...state, showMedia: action.payload };
    },
    toggleMediaSide: (state, action) => {
      return { ...state, mediaSide: !state.mediaSide };
    },
    setIsPlaying: (state, action) => {
      return { ...state, isPlaying: action.payload };
    },
    setAutoPlay: (state, action) => {
      return { ...state, autoPlay: action.payload };
    },
    setCurrentTime: (state, action) => {
      return { ...state, currentTime: action.payload };
    },
  },
});

const { reducer, actions } = mediaSlice;

export const { setShowMedia, toggleMediaSide, setIsPlaying, setCurrentTime } = actions;
export default reducer;
