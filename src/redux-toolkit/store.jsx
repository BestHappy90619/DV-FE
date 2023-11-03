import { configureStore } from "@reduxjs/toolkit";
import mediaReducer from "@/redux-toolkit/reducers/Media";
import SidebarReducer from "@/redux-toolkit/reducers/Sidebar";
import EditorReducer from "@/redux-toolkit/reducers/Editor";

const reducer = {
  media: mediaReducer,
  sidebar: SidebarReducer,
  editor: EditorReducer
};

export const store = configureStore({
  reducer: reducer,
  devTools: true,
});
