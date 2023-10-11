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
    };
  },
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } = usersApiSlice;
