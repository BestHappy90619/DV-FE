import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  minWidth: 250,
  maxWidth: 400,
  defaultWidth: 250,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    initSidebar: (state, action) => {
      return initialState;
    }
  },
});

const { reducer, actions } = sidebarSlice;

export const { initSidebar } = actions;
export default reducer;
