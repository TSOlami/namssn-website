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
		}
	},
});

export const {
	useAllEventsQuery,
} = eventsApiSlice;