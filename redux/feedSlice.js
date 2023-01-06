import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  loadingPercent: 0,
  coubs: [],
  filteredCoubs: [],
};

export const counterSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLoadingPercent: (state, action) => {
      state.loadingPercent = action.payload;
    },
    addCoubs: (state, action) => {
      state.coubs = [...state.coubs, ...action.payload];
    },
    addFilteredCoubs: (state, action) => {
      state.filteredCoubs = [...state.filteredCoubs, ...action.payload];
    },
    clearCoubs: (state) => {
      state.coubs = [];
    },
    clearFilteredCoubs: (state) => {
      state.filteredCoubs = [];
    },
  },
});

export const selectIsLoading = (state) => state.feed.isLoading;
export const selectLoadingPercent = (state) => state.feed.loadingPercent;
export const selectCoubs = (state) => state.feed.coubs;
export const selectFilteredCoubs = (state) => state.feed.filteredCoubs;

export const {
  setIsLoading,
  setLoadingPercent,
  addCoubs,
  addFilteredCoubs,
  clearCoubs,
  clearFilteredCoubs,
} = counterSlice.actions;

export default counterSlice.reducer;
