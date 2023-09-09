import { MEDIA_TYPE_VIDEO } from "@/utils/constant";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMedia: {},
  showMedia: false,
  mediaSide: true, //true: left, false: right
  duration: 0,
  currentTimeline: 0
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setSelectedMedia: (state, action) => {
      return { ...state, selectedMedia: action.payload, showMedia: action.payload.type == MEDIA_TYPE_VIDEO ? true : false };
    },
    setShowMedia: (state, action) => {
      return { ...state, selectedMedia: state.selectedMedia, showMedia: action.payload };
    },
    clearSelectedMedia: (state, action) => {
      return { ...state, selectedMedia: {}, showMedia: false };
    },
    toggleMediaSide: (state, action) => {
      return { ...state, mediaSide: !state.mediaSide };
    },
    setCurrentTimeline: (state, action) => {
      return { ...state, currentTimeline: action.payload}
    },
    setDuration: (state, action) => {
      return { ...state, duration: action.payload}
    }
  },
});

const { reducer, actions } = mediaSlice;

export const { setSelectedMedia, clearSelectedMedia, setShowMedia, toggleMediaSide, setCurrentTimeline, setDuration } = actions;
export default reducer;
