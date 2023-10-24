import { createSlice } from "@reduxjs/toolkit";
import { STATUS_ACTIVE } from "../../utils/constant";

const initialState = {
  currentUser: {
    name: 'Serhil Movchan',
    status: STATUS_ACTIVE
  }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    
  },
});

const { reducer, actions } = userSlice;

export const { } = actions;
export default reducer;
