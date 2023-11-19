import { apiSlice } from "./apiSlice";

const ADMIN_URL = "/api/v1/admin";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      // Get Total Users Query
      getTotalUsers: builder.query({
        query() {
          return {
            url: `${ADMIN_URL}/total-users`,
            method: 'GET',
          };
        },
      }),

      // Get Total Posts Query
      getTotalPosts: builder.query({
        query() {
          return {
            url: `${ADMIN_URL}/total-posts`,
            method: 'GET',
          };
        },
      }),

      // Get Total Announcements Query
      getTotalAnnouncements: builder.query({
        query() {
          return {
            url: `${ADMIN_URL}/total-announcements`,
            method: 'GET',
          };
        },
      }),

      // Get Total Blogs Query
      getTotalBlogs: builder.query({
        query() {
          return {
            url: `${ADMIN_URL}/total-blogs`,
            method: 'GET',
          };
        },
      }),

      // Get Total Events Query
      getTotalEvents: builder.query({
        query() {
          return {
            url: `${ADMIN_URL}/total-events`,
            method: 'GET',
          };
        },
      }),

      // Get Total Payments Query
      getTotalPayments: builder.query({
        query() {
          return {
            url: `${ADMIN_URL}/total-payments`,
            method: 'GET',
          };
        },
      }),

      // Get all users
      getAllUsers: builder.query({
        query() {
          return {
            url: `${ADMIN_URL}/all-users`,
            method: 'GET',
          };
        },
      }),

      // Send mail to all users
      mailNotice: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_URL}/notice-mail`,
            method: 'POST',
            body: data,
          };
        },
      }),

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
        query(eventId, data) {
          return {
            url: `${ADMIN_URL}/events/${eventId}`,
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

export const {
  useGetTotalUsersQuery,
  useGetTotalPostsQuery,
  useGetTotalBlogsQuery,
  useGetTotalAnnouncementsQuery,
  useGetTotalEventsQuery,
  useGetTotalPaymentsQuery,
  useMakeUserAdminMutation,
  useRemoveAdminMutation,
  useGetAllPaymentsQuery,
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetAllUsersQuery,
  useMailNoticeMutation,
} = adminApiSlice;