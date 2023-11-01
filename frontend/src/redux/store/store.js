import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import { apiSlice } from '../slices/apiSlice';
import navReducer from '../slices/navSlice';
import { usersApiSlice } from '../slices/usersApiSlice';

const store = configureStore({
	reducer: {
		auth: authReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
		nav: navReducer,
		users: usersApiSlice
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: true
});

export default store;
