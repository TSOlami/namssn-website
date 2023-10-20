import { apiSlice } from "./apiSlice";

const USERS_URL = '/api/v1/users';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      // Login Query
      login: builder.mutation({
        query(data) {
          return {
            url: `${USERS_URL}/auth`,
            method: 'POST',
            body: data,
          };
        },
      }),

      // Register Query
      register: builder.mutation({
        query(data) {
          return {
            url: `${USERS_URL}/`,
            method: 'POST',
            body: data,
          };
        },
      }),

      // Send Register Email Query
      registerMail: builder.mutation({
        query(data) {
          return {
            url: `${USERS_URL}/register-mail`,
            method: 'POST',
            body: data,
          };
        },
      }),

      // Logout Query
      logout: builder.mutation({
        query() {
          return {
            url: `${USERS_URL}/logout`,
            method: 'POST',
          };
        },
      }),

      // Get User Query
      getUser: builder.query({
        query({ _id }) {
          return {
            url: `${USERS_URL}/profile/${_id}`,
            method: 'GET',
          };
        },
        providesTags: ['User'],
      }),

      // Update User Query
      updateUser: builder.mutation({
        query(data) {
          return {
            url: `${USERS_URL}/profile`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['User'],
      }),

      // Delete User Query
      deleteUser: builder.mutation({
        query(data) {
          return {
            url: `${USERS_URL}/profile`,
            method: 'DELETE',
            body: data,
          };
        },
        invalidatesTags: ['User'],
      }),

      // Get All Blogs Query
      allBlogs: builder.query({
        query() {
          return {
            url: `${USERS_URL}/blogs`,
            method: 'GET',
          };
        },
      }),
      
    };
  },
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useRegisterMailMutation, useUpdateUserMutation, useGetUserQuery, useAllBlogsQuery } = usersApiSlice;