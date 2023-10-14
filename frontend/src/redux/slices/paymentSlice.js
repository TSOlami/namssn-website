import { apiSlice } from "./apiSlice";

const ADMIN_PAYMENTS_URL = '/api/v1/admin';
const USER_PAYMENT_URL = ' /api/v1/user';

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
      updateCategory: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_PAYMENTS_URL}/payment`,
            method: 'PUT',
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
    };



  },
});

export const {
  useAllCategorysQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreatePaymentMutation,
  useAllPaymentsQuery
} = CategoryApiSlice;
