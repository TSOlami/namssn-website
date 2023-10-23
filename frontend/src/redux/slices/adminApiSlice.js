import { apiSlice } from "./apiSlice";

const ADMIN_URL = "/api/v1/admin";

export const adminApiSlice = apiSlice.injectEndpoints({
	endpoints(builder) {
		return {	
      // Make a user admin
      makeUserAdmin: builder.mutation({
        query(userId) {
          return {
            url: `${ADMIN_URL}/make-admin/${userId}`,
            method: 'PUT',
          };
        },
        invalidatesTags: ['User'],
      }),

      // Remove admin privileges from a user
      removeAdmin: builder.mutation({
        query(_id) {
          return {
            url: `${ADMIN_URL}/remove-admin/${_id}`,
            method: 'PUT',
          };
        },
        invalidatesTags: ['User'],
      }),

      // Create Blog Query
      createBlog: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_URL}/blog`,
            method: 'POST',
            body: data,
          };
        },
        invalidatesTags: ['Blog'],
      }),

      // Update Blog Query
      updateBlog: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_URL}/blog`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['Blog'],
      }),

      // Delete Blog Query
      deleteBlog: builder.mutation({
        query(blogId) {
          console.log(blogId);

          return {
            url: `${ADMIN_URL}/blog/${blogId}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['Blog'],
      }),

      // Create Event Mutation
      createEvent: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_URL}/events`,
            method: 'POST',
            body: data,
          };
        },
        invalidatesTags: ['Event'],
      }),

      // Update Event Mutation
      updateEvent: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_URL}/events`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['Event'],
      }),

      // Delete Event Mutation
      deleteEvent: builder.mutation({
        query(eventId) {
          return {
            url: `${ADMIN_URL}/events/${eventId}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['Event'],
      }),

      // Get user Events Query
      getUserEvents: builder.query({
        query() {
          return {
            url: `${ADMIN_URL}/events`,
            method: 'GET',
          };
        },
        providesTags: ['Event'],
      }),

      // Get all payments
      getAllPayments: builder.query({
        query() {
          return {
            url: `${ADMIN_URL}/all-payments`,
            method: 'GET',
          };
        },
        providesTags: ['Payment'],
      }),
    }
  }
});

export const { useMakeUserAdminMutation, useRemoveAdminMutation, useGetAllPaymentsQuery, useCreateBlogMutation, useDeleteBlogMutation, useUpdateBlogMutation, useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } = adminApiSlice;