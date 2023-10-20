import { apiSlice } from "./apiSlice";

const ADMIN_PAYMENTS_URL = '/api/v1/admin';
const USER_PAYMENT_URL = ' /api/v1/users';

export const CategoryApiSlice = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      // Get All Admin Payments Query
      allCategory: builder.query({
        query() {
          return {
            url: `${ADMIN_PAYMENTS_URL}/all-payments`,
            method: 'GET',
          };
        },
      }),

      // Create Category
      createCategory: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_PAYMENTS_URL}/payment`,
            method: 'POST',
            body: data,
          };
        },
      }),

      // Update Category
      verifyPayments: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_PAYMENTS_URL}/payment`,
            method: 'GET',
            body: data,
          };
        },
      }),

      // Delete Category
      deleteCategory: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_PAYMENTS_URL}/payment`,
            method: 'DELETE',
            body: data,
          };
        },
      }),

      // Get All Admin Payments Query
      allPayments: builder.query({
        query() {
          return {
            url: `${USER_PAYMENT_URL}/payments`,
            method: 'GET',
          };
        },
      }),
      // Create Payment
      createPayment: builder.mutation({
        query(data) {
          return {
            url: `${USER_PAYMENT_URL}/payments`,
            method: 'POST',
            body: data,
          };
        },
      }),

      // user payments
      userPayments: builder.query({
        query({ _id }) {
          return {
            url: `${USER_PAYMENT_URL}/payments/${_id}`,
            method: 'GET',
          };
        },
        invalidatesTags: ['Payments'],
      }),
    };



  },
});

export const {
  useAllCategorysQuery,
  useCreateCategoryMutation,
  useVerifyPaymentsMutation,
  useDeleteCategoryMutation,
  useCreatePaymentMutation,
  useAllPaymentsQuery,
  useUserPaymentsQuery,
} = CategoryApiSlice;
