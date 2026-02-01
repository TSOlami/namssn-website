/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

const getStoredUserProfile = () => {
	try {
		let item = localStorage.getItem('userProfile');
		if (item) return JSON.parse(item);
		item = localStorage.getItem('userInfo');
		if (item) {
			const parsed = JSON.parse(item);
			const { token, ...profile } = parsed;
			localStorage.setItem('userProfile', JSON.stringify(profile));
			localStorage.removeItem('userInfo');
			return profile;
		}
		return null;
	} catch {
		return null;
	}
};

export const initialState = {
	userInfo: getStoredUserProfile() || null,
	posts: null,
	announcements: null,
	payments: null,
	category: null,
	blog: null,
	events: null,
	notification: null,
	unreadNotificationsCount: null,
	currentPage: 1,
	pageSize: 2,
	details: {},
};

const authSlice = createSlice({
	name : 'auth',
	initialState,
	reducers: {
		setCredentials(state, action) {
			state.userInfo = { ...state.userInfo, ...action.payload };
			// Persist profile only for display after refresh; never persist token (XSS-safe).
			const { token, ...profile } = state.userInfo;
			localStorage.setItem('userProfile', JSON.stringify(profile));
		},
    logout: (state) => {
      state.userInfo = null;
      state.posts = null;
      state.announcements = null;
      state.payments = null;
      state.category = null;
      state.notification = null;
      state.unreadNotificationsCount = null;
      localStorage.removeItem('userProfile');
      ['userInfo', 'userPosts', 'userAnnouncements', 'userPayments', 'userCategories', 'userBlogs', 'userEvents', 'userNotifications'].forEach((k) => localStorage.removeItem(k));
    },
    setPosts(state, action) {
      state.posts = action.payload;
    },
    setAnnouncements(state, action) {
      state.announcements = action.payload;
    },
    setPayments(state, action) {
      state.payments = action.payload;
    },
    setCategories(state, action) {
      state.category = action.payload;
    },
    setBlogs(state, action) {
      state.blog = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setEvents(state, action) {
      state.events = action.payload;
    },
    setNotifications(state, action) {
      state.notification = action.payload;
      const count = Array.isArray(action.payload) ? action.payload.filter((n) => !n?.seen).length : null;
      if (count !== null) state.unreadNotificationsCount = count;
    },
    setUnreadNotificationsCount(state, action){
      state.unreadNotificationsCount = action.payload;
    },
	},
});

export const {addFileDetails, setCredentials, setPosts, setAnnouncements, setPayments,setCategories, setBlogs, setCurrentPage, setEvents, setNotifications, setUnreadNotificationsCount, logout } = authSlice.actions;

export default authSlice.reducer;
