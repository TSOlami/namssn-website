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

export const { useMakeUserAdminMutation, useRemoveAdminMutation, useGetAllPaymentsQuery, useCreateBlogMutation } = adminApiSlice;