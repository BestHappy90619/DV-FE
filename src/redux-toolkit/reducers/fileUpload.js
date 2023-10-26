import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for uploading the file
export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async (file) => {
    const formData = new FormData();
    formData.append('fileName', file);
    formData.append('directoryId', 0);

    const response = await fetch('http://35.224.48.157:3000/upload/media', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    loading: false,
    error: null,
    data: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default uploadSlice.reducer;
