import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  users: [], // This array will contain the list of all users
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export default usersSlice.reducer;