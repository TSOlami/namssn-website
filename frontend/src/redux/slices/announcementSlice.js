import { apiSlice } from "./apiSlice";

const ANNOUCEMENTS_URL = "/api/v1/users";

export const announcementsApiSlice = apiSlice.injectEndpoints({
	endpoints(builder) {
		return {
			// Get All Announcements Query
			allAnnouncements: builder.query({
				query() {
					return {
						url: `${ANNOUCEMENTS_URL}/announcements`,
						method: "GET",
					};
				},
				providesTags: ["Announcement"],
			}),

			// Get User Announcements Query
			userAnnouncements: builder.query({
				query({ _id }) {
					return {
						url: `${ANNOUCEMENTS_URL}/announcement/${_id}`,
						method: "GET",
					};
				},
				invalidatesTags: ["Announcement"],
			}),

			// Create Announcement Query
			createAnnouncement: builder.mutation({
				query(data) {
					return {
						url: `${ANNOUCEMENTS_URL}/announcement`,
						method: "POST",
						body: data,
					};
				},
				invalidatesTags: ["Announcement"],
			}),

			// Update Announcement Query
			updateAnnouncement: builder.mutation({
				query(data) {
					return {
						url: `${ANNOUCEMENTS_URL}/announcement`,
						method: "PUT",
						body: data,
					};
				},
				invalidatesTags: ["Announcement"],
			}),

			// Delete Announcement Query
			deleteAnnouncement: builder.mutation({
				query(data) {
					return {
						url: `${ANNOUCEMENTS_URL}/announcement`,
						method: "DELETE",
						body: data,
					};
				},
				invalidatesTags: ["Announcement"],
			}),
		};
	},
});