/* eslint-disable no-unused-vars */
import produce from 'immer';
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
  announcements: getLocalStorageItem('userAnnouncements') || null,
  payments: getLocalStorageItem('userPayments') || null,
  category: getLocalStorageItem('userCategories') || null,
  blog: getLocalStorageItem('userBlogs') || null,
  events: getLocalStorageItem('userEvents') || null,
  notification: getLocalStorageItem('userNotifications') || null,
  currentPage: 1,
  pageSize: 2,
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
      state.announcements = null;
      state.payments = null;
      state.category = null;
      state.notification = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userPosts');
      localStorage.removeItem('userAnnouncements');
      localStorage.removeItem('userPayments');
      localStorage.removeItem('userCategories');
      localStorage.removeItem('userNotifications');
    },
    setPosts(state, action) {
      state.posts = action.payload;
      localStorage.setItem('userPosts', JSON.stringify(action.payload));
    },
    setAnnouncements(state, action) {
      state.announcements = action.payload;
      localStorage.setItem('userAnnouncements', JSON.stringify(action.payload));
    },
    setPayments(state, action){
      state.payments = action.payload;
      localStorage.setItem('userPayments', JSON.stringify(action.payload));
    },
    setCategories(state, action){
      state.category =action.payload;
      localStorage.setItem('userCategories', JSON.stringify(action.payload));
    },
    setBlogs(state, action){
      state.blog =action.payload;
      localStorage.setItem('userBlogs', JSON.stringify(action.payload));
    },
    setCurrentPage(state, action){
      state.currentPage = action.payload;
    },
    setEvents(state, action){
      state.events = action.payload;
      localStorage.setItem('userEvents', JSON.stringify(action.payload));
    },
    setNotifications(state, action){
      state.notification = action.payload;
      localStorage.setItem('userNotifications', JSON.stringify(action.payload));
    },
	},
});

export const { setCredentials, setPosts, setAnnouncements, setPayments,setCategories, setBlogs, setCurrentPage, setEvents, setNotifications, logout } = authSlice.actions;
export default authSlice.reducer;
