/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

// Helper function to get items from local storage
const getLocalStorageItem = (key) => {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	} catch (error) {
		console.error('Error retrieving item from local storage:', error);
		return null;
	}
  };

export const initialState = {
	userInfo: getLocalStorageItem('userInfo') || null,
  posts: getLocalStorageItem('userPosts') || null,
}

const authSlice = createSlice({
	name : 'auth',
	initialState,
	reducers: {
		setCredentials(state, action) {
			state.userInfo = action.payload;
			localStorage.setItem('userInfo', JSON.stringify(action.payload));
		},
    logout: (state, action) => {
      state.userInfo = null;
      state.posts = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userPosts');
    },
    setPosts(state, action) {
      state.posts = action.payload;
      localStorage.setItem('userPosts', JSON.stringify(action.payload));
    },
    setAnnouncements(state, action) {
      state.announcements = action.payload;
      localStorage.setItem('userAnnouncements', JSON.stringify(action.payload));
    },
	},
});

export const { setCredentials, setPosts, setAnnouncements, logout } = authSlice.actions;

export default authSlice.reducer;
