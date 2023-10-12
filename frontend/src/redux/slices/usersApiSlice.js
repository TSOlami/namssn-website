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
      }),
    };
  },
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserMutation, useGetUserQuery } = usersApiSlice;
