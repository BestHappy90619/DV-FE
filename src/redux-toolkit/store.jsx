import { configureStore } from "@reduxjs/toolkit";
import mediaReducer from "./reducers/Media";
import SidebarReducer from "./reducers/Sidebar";
import EditorReducer from "./reducers/Editor";
import DirectoryReducer from "./reducers/fileTreeSlice.js"
import uploadReducer from './reducers/fileUpload'; 
import fileTreeSliceDetailReducer from "./reducers/fileTreeSliceDetail"
const reducer = {
  media: mediaReducer,
  sidebar: SidebarReducer,
  editor: EditorReducer,
  directory:DirectoryReducer,
  upload: uploadReducer,
  detail:fileTreeSliceDetailReducer,

};

export const store = configureStore({
  reducer: reducer,
  devTools: true,
});
