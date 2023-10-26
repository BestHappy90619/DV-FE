import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAdditionalData = createAsyncThunk(
  "fileTree/fetchAdditionalData",
  async (paramValue) => {
    const response = await axios.get(
      `http://35.224.48.157:3000/directory/?directoryId=${paramValue}`
    );
    return response.data;
  }
);

const initialState = {
  data: {
    date: [],
    breadCrumb: [],
  },
  status: "idle",
  error: null,
};

const fileTreeSliceDetail = createSlice({
  name: "fileTreeDetail",
  initialState,
  reducers: {
    draggedItem: (state, action) => {
      state.data.date = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdditionalData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdditionalData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.date = action.payload.date;
        state.data.breadCrumb = action.payload.breadCrumb;
      })
      .addCase(fetchAdditionalData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { draggedItem } = fileTreeSliceDetail.actions;
export default fileTreeSliceDetail.reducer;

export const selectAdditionalData = (state) => {
  return state.detail ? state.detail.data : null;
};
