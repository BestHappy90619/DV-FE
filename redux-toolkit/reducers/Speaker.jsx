import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  speakers: ["John Brown", "Miss Marple"],
  speakerMethod: true, // true: Horizontal false: vertical
};

const speakerSlice = createSlice({
  name: "speaker",
  initialState,
  reducers: {
    toggleSpeaker: (state, action) => {
      return { ...state, speakerMethod: !state.speakerMethod };
    },
    addSpeaker: (state, action) => {
      if(action.payload.length)
        return { ...state, speakers: [...state.speakers, action.payload] };
    },
    editSpeaker: (state, action) => {
      var id = action.payload.id;
      var val = action.payload.val;
      if (val.length) {
        state.speakers[id] = val;
      } else {
        state.speakers.splice(id, 1);
      }
      return;
    }
  },
});

const { reducer, actions } = speakerSlice;

export const { toggleSpeaker, addSpeaker, editSpeaker } = actions;
export default reducer;
