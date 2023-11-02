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

      // Verify Account Query
      verifyAccount: builder.mutation({
        query(data) {
          return {
            url: `${USERS_URL}/verify-account`,
            method: 'POST',
            body: data,
          };
        },
        invalidatesTags: ['User'],
      }),

      // Send mail
      sendMail: builder.mutation({
        query(data) {
          return {
            url: `${USERS_URL}/register-mail`,
            method: 'POST',
            body:data,
          };
        },
        invalidatesTags: ['User'],
      }),

      // Contact Us
      contactUs: builder.mutation({
        query(data) {
          return {
            url: `${USERS_URL}/contact-us`,
            method: 'POST',
            body:data,
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

      // Reset Password Query
      resetPassword: builder.mutation({
        query(data) {
          console.log(data);
          return {
            url: `${USERS_URL}/reset-password`,
            method: 'PUT',
            body: data,
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
        providesTags: ['Blog'],
      }),
      
    };
  },
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserMutation, useGetUserQuery, useAllBlogsQuery, useVerifyAccountMutation, useSendMailMutation, useResetPasswordMutation, useContactUsMutation } = usersApiSlice;
