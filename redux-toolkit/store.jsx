import { configureStore } from "@reduxjs/toolkit";
import mediaReducer from "./reducers/Media";
import SidebarReducer from "./reducers/Sidebar";
import SpeakerReducer from "./reducers/Speaker";
import EditorReducer from "./reducers/Editor";

const reducer = {
  media: mediaReducer,
  sidebar: SidebarReducer,
  speaker: SpeakerReducer,
  editor: EditorReducer
};

export const store = configureStore({
  reducer: reducer,
  devTools: true,
});
