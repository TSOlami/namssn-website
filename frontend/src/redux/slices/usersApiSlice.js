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

      // Make a user admin
      makeUserAdmin: builder.mutation({
        query(data) {
          return {
            url: `${USERS_URL}/make-admin/${data.userId}`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['User'],
      }),

      // Remove admin privileges from a user
      removeAdmin: builder.mutation({
        query(data) {
          return {
            url: `${USERS_URL}/remove-admin/${data.userId}`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['User'],
      }),
    };
  },
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useRegisterMailMutation, useUpdateUserMutation, useGetUserQuery, useMakeUserAdminMutation, useRemoveAdminMutation } = usersApiSlice;
