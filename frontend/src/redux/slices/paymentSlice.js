import { apiSlice } from "./apiSlice";

const ADMIN_PAYMENTS_URL = '/api/v1/admin';

export const adminPaymentApiSlice = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      // Get All Admin Payments Query
      allAdminPayments: builder.query({
        query() {
          return {
            url: `${ADMIN_PAYMENTS_URL}/payment`,
            method: 'GET',
          };
        },
      }),

      // Create Admin Payment Query
      createAdminPayment: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_PAYMENTS_URL}/payment`,
            method: 'POST',
            body: data,
          };
        },
      }),

      // Update Admin Payment Query
      updateAdminPayment: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_PAYMENTS_URL}/payment`,
            method: 'PUT',
            body: data,
          };
        },
      }),

      // Delete Admin Payment Query
      deleteAdminPayment: builder.mutation({
        query(data) {
          return {
            url: `${ADMIN_PAYMENTS_URL}/payment`,
            method: 'DELETE',
            body: data,
          };
        },
      }),
    };
  },
});

export const {
  useAllAdminPaymentsQuery,
  useCreateAdminPaymentMutation,
  useUpdateAdminPaymentMutation,
  useDeleteAdminPaymentMutation,
} = adminPaymentApiSlice;
