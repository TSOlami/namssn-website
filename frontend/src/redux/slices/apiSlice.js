/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';

const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL ?? '').replace(/\/$/, '');
const baseQuery = fetchBaseQuery({
	baseUrl: API_BASE,
	credentials: 'include',
});

const baseQueryWithBlockedHandling = async (args, api, extraOptions) => {
	const result = await baseQuery(args, api, extraOptions);
	if (result.error?.status === 403) {
		const message = result.error?.data?.message ?? '';
		if (typeof message === 'string' && message.toLowerCase().includes('blocked')) {
			api.dispatch(logout());
			window.location.replace('/signin?blocked=1');
		}
	}
	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithBlockedHandling,
	tagTypes: ['User', 'Post', 'Blog', 'Payment', 'Resource', 'Announcement', 'Event', 'Notification', 'ETest'],
	endpoints: (builder) => ({}),
	// Redux caching: keep data longer, refetch less often
	keepUnusedDataFor: 300, // 5 min – cache survives 5 min after last subscriber
	refetchOnMountOrArgChange: 60, // refetch on mount only if data older than 60s
	refetchOnFocus: false,
	refetchOnReconnect: true,
});
