import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  navOpen: false,
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setNavOpen(state) {
      state.navOpen = !state.navOpen;
    },
  },
});

export const { setNavOpen } = navSlice.actions;

export default navSlice.reducer;