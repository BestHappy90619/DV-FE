import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    zoomTranscriptNum: 100
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setZoomTranscriptNum: (state, action) => {
      return { ...state, zoomTranscriptNum: action.payload };
    },
  },
});

const { reducer, actions } = editorSlice;

export const { setZoomTranscriptNum } = actions;
export default reducer;
