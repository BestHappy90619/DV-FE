import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./reducers/User";

const reducer = {
  user: UserReducer,
};

export const store = configureStore({
  reducer: reducer,
  devTools: true,
});
