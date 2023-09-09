import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // leftsidebar width
  leftSidebarWidth: 0,
  rightSidebarWidth: 0,

  // show sidebar as per order(+: left sidebar order, -: right sidebar order 1/-1: hidden)
  playlistOrder: 1,
  noteOrder: 1,
  searchOrder: 1,
};

const getMaxOrder = (playlistOrder, noteOrder, searchOrder) => {
  return playlistOrder > noteOrder ?
    playlistOrder > searchOrder ? playlistOrder : searchOrder
    :
    noteOrder > searchOrder ? noteOrder : searchOrder;
}

const getMinOrder = (playlistOrder, noteOrder, searchOrder) => {
  return playlistOrder < noteOrder ?
    playlistOrder < searchOrder ? playlistOrder : searchOrder
    :
    noteOrder < searchOrder ? noteOrder : searchOrder;
}

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setLeftSidebarWidth: (state, action) => {
      return { ...state, leftSidebarWidth: action.payload};
    },
    setRightSidebarWidth: (state, action) => {
      return { ...state, rightSidebarWidth: action.payload};
    },
    togglePlaylist: (state, action) => {
      var newOrder = 1;
      var oldOrder = state.playlistOrder;
      var minOrder = getMinOrder(oldOrder, state.noteOrder, state.searchOrder);
      var maxOrder = getMaxOrder(oldOrder, state.noteOrder, state.searchOrder);
      if (oldOrder < -1) oldOrder > minOrder ? newOrder = minOrder - 1 : newOrder = -1
      else if (oldOrder > 1) oldOrder < maxOrder ? newOrder = maxOrder + 1 : newOrder = 1
      else if (oldOrder == -1) newOrder = minOrder - 1;
      else if (oldOrder == 1) newOrder = maxOrder + 1;
      return { ...state, playlistOrder: newOrder};
    },
    toggleNote: (state, action) => {
      var newOrder = 1;
      var oldOrder = state.noteOrder;      
      var minOrder = getMinOrder(state.playlistOrder, oldOrder, state.searchOrder);
      var maxOrder = getMaxOrder(state.playlistOrder, oldOrder, state.searchOrder);
      if (oldOrder < -1) oldOrder > minOrder ? newOrder = minOrder - 1 : newOrder = -1
      else if (oldOrder > 1) oldOrder < maxOrder ? newOrder = maxOrder + 1 : newOrder = 1
      else if (oldOrder == -1) newOrder = minOrder - 1;
      else if (oldOrder == 1) newOrder = maxOrder + 1;
      return { ...state, noteOrder: newOrder};
    },
    toggleSearch: (state, action) => {
      var newOrder = 1;
      var oldOrder = state.searchOrder;      
      var minOrder = getMinOrder(state.playlistOrder, state.noteOrder, oldOrder);
      var maxOrder = getMaxOrder(state.playlistOrder, state.noteOrder, oldOrder);
      if (oldOrder < -1) oldOrder > minOrder ? newOrder = minOrder - 1 : newOrder = -1
      else if (oldOrder > 1) oldOrder < maxOrder ? newOrder = maxOrder + 1 : newOrder = 1
      else if (oldOrder == -1) newOrder = minOrder - 1;
      else if (oldOrder == 1) newOrder = maxOrder + 1;
      return { ...state, searchOrder: newOrder};
    },
    setPlaylistSidebarPosition: (state, action) => {
      var newOrder = 1;
      var oldOrder = state.playlistOrder;
      if (Math.abs(oldOrder) == 1) newOrder = oldOrder * -1;
      else if (oldOrder < -1) newOrder = getMaxOrder(oldOrder * -1, state.noteOrder, state.searchOrder) + 1;
      else if (oldOrder > 1) newOrder = getMinOrder(oldOrder * -1, state.noteOrder, state.searchOrder) - 1;
      return { ...state, playlistOrder: newOrder };
    },
    setNoteSidebarPosition: (state, action) => {
      var newOrder = 1;
      var oldOrder = state.noteOrder;
      if (Math.abs(oldOrder) == 1) newOrder = oldOrder * -1;
      else if (oldOrder < -1) newOrder = getMaxOrder(state.playlistOrder, oldOrder * -1, state.searchOrder) + 1;
      else if (oldOrder > 1) newOrder = getMinOrder(state.playlistOrder, oldOrder * -1, state.searchOrder) - 1;
      return { ...state, noteOrder: newOrder };
    },
    setSearchSidebarPosition: (state, action) => {
      var newOrder = 1;
      var oldOrder = state.searchOrder;
      if (Math.abs(oldOrder) == 1) newOrder = oldOrder * -1;
      else if (oldOrder < -1) newOrder = getMaxOrder(state.playlistOrder, state.noteOrder, oldOrder * -1) + 1;
      else if (oldOrder > 1) newOrder = getMinOrder(state.playlistOrder, state.noteOrder, oldOrder * -1) - 1;
      return { ...state, searchOrder: newOrder };
    },
  },
});

const { reducer, actions } = sidebarSlice;

export const { togglePlaylist, toggleNote, toggleSearch, setPlaylistSidebarPosition, setNoteSidebarPosition, setSearchSidebarPosition, setLeftSidebarWidth, setRightSidebarWidth } = actions;
export default reducer;
