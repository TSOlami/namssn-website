import { apiSlice } from "./apiSlice";

const EVENTS_URL = "/api/v1/users";

export const eventsApiSlice = apiSlice.injectEndpoints({
	endpoints(builder) {
		return {
			// Get All Events Query
			allEvents: builder.query({
				query() {
					return {
						url: `${EVENTS_URL}/events`,
						method: "GET",
					};
				},
				providesTags: ["Event"],
			}),

			// Get User Events Query
			userEvents: builder.query({
				query({ _id }) {
					return {
						url: `${EVENTS_URL}/event/${_id}`,
						method: "GET",
					};
				},
				invalidatesTags: ["Event"],
			}),

			// Create Event Query
			createEvent: builder.mutation({
				query(data) {
					return {
						url: `${EVENTS_URL}/event`,
						method: "POST",
						body: data,
					};
				},
				invalidatesTags: ["Event"],
			}),

			// Update Event Query
			updateEvent: builder.mutation({
				query(data) {
					return {
						url: `${EVENTS_URL}/event`,
						method: "PUT",
						body: data,
					};
				},
				invalidatesTags: ["Event"],
			}),

			// Delete Event Query
			deleteEvent: builder.mutation({
				query(data) {
					return {
						url: `${EVENTS_URL}/event`,
						method: "DELETE",
						body: data,
					};
				},
				invalidatesTags: ["Event"],
			}),
		}
	},
});