/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';

const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL ?? '').replace(/\/$/, '');
const API_REQUEST_TIMEOUT_MS = 30000;
const MAX_NETWORK_RETRIES = 2;

const rawBaseQuery = fetchBaseQuery({
	baseUrl: API_BASE,
	credentials: 'include',
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth?.userInfo?.token;
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithTimeout = async (args, api, extraOptions = {}) => {
	const timeoutMs = typeof extraOptions.timeout === 'number' ? extraOptions.timeout : API_REQUEST_TIMEOUT_MS;
	const abortController = new AbortController();

	const finalExtraOptions = {
		...extraOptions,
		signal: abortController.signal,
	};

	const timeoutId = setTimeout(() => {
		abortController.abort();
	}, timeoutMs);

	try {
		return await rawBaseQuery(args, api, finalExtraOptions);
	} finally {
		clearTimeout(timeoutId);
	}
};

const baseQueryWithBlockedHandling = async (args, api, extraOptions) => {
	const result = await baseQueryWithTimeout(args, api, extraOptions);
	if (result.error?.status === 401) {
		const url = typeof args === 'string' ? args : args?.url ?? '';
		const isLoginOrRegister = url.includes('/auth') || (url.endsWith('/users') && typeof args === 'object' && args.method === 'POST');
		if (!isLoginOrRegister) {
			api.dispatch(logout());
			window.location.replace('/signin?session=expired');
		}
		return result;
	}
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
	baseQuery: retry(baseQueryWithBlockedHandling, {
		maxRetries: MAX_NETWORK_RETRIES,
	}),
	tagTypes: ['User', 'Post', 'Blog', 'Payment', 'Resource', 'Announcement', 'Event', 'Notification', 'ETest'],
	endpoints: (builder) => ({}),
	keepUnusedDataFor: 1800,
	refetchOnMountOrArgChange: 60,
	refetchOnFocus: false,
	refetchOnReconnect: true,
});
