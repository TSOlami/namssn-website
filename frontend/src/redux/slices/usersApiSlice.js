import { apiSlice } from "./apiSlice";

const USERS_URL = '/api/v1/users';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      login: builder.mutation({
        query(data) {
          return {
            url: `${USERS_URL}/auth`,
            method: 'POST',
            body: data,
          };
        },
      }),
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

export const { useLoginMutation, useLogoutMutation } = usersApiSlice;
