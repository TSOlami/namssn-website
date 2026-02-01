/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: '', credentials: 'include' });

export const apiSlice = createApi({
	baseQuery,
	tagTypes: ['User', 'Post', 'Blog', 'Payment', 'Resource', 'Announcement', 'Event', 'Notification', 'ETest'],
	endpoints: (builder) => ({}),
});
