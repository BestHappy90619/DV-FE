// fileTreeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Assuming you're using axios for API calls

// Fetching the data from the API endpoint
export const fetchData = createAsyncThunk(
  "fileTree/fetchData",
  async (directoryId = 0) => {
    const response = await axios.get(
      `http://35.224.48.157:3000/directory/?directoryId=${directoryId}`
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


const fileTreeSlice = createSlice({
  name: "fileTree",
  initialState,
  reducers: {
    rowDropped: (state, action) => {
      // Handle row dropping logic here
      // const { id, newPosition } = action.payload;
      // Remove the row with the specified ID from state.data.date
      // const updatedDate = state.data.date.filter((row) => row.Id !== id);

      // Insert the row back at the new position
      // updatedDate.splice(newPosition, 0, state.data.date.find((row) => row.Id === id));

      // state.data.date = updatedDate;
      state.data.date = action.payload;
    },
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.date = action.payload.date;
        state.data.breadCrumb = action.payload.breadCrumb;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { rowDropped } = fileTreeSlice.actions;

export default fileTreeSlice.reducer;


export const selectFileTreeData = (state) => {

  return state.directory ? state.directory.data : null;
};
