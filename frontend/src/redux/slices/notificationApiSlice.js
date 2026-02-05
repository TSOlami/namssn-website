import { apiSlice } from "./apiSlice";

const NOTIFICATION_URL = "/api/v1/users";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Define a `getNotifications` endpoint that queries `NOTIFICATION_URL/notifications`
    getNotifications: builder.query({
      query: () => ({
        url: `${NOTIFICATION_URL}/notifications`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    // Paginated notifications for infinite scroll UI
    getNotificationsPaged: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: `${NOTIFICATION_URL}/notifications?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    // Define a `deleteNotification` endpoint that queries `NOTIFICATION_URL/notifications/:notificationId`
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `${NOTIFICATION_URL}/notifications/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    // Define a `markNotificationsAsSeen` endpoint that queries `NOTIFICATION_URL/notifications/seen`
    markNotificationsAsSeen: builder.mutation({
      query: (notificationId) => ({
        url: `${NOTIFICATION_URL}/notifications/seen`,
        method: "PUT",
        body: { notificationId },
      }),
      invalidatesTags: ["Notification"],
    }),

    // Define a `clearNotifications` endpoint that queries `NOTIFICATION_URL/notifications`
    clearNotifications: builder.mutation({
      query: () => (
        {
        url: `${NOTIFICATION_URL}/notifications`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetNotificationsPagedQuery,
  useDeleteNotificationMutation,
  useMarkNotificationsAsSeenMutation,
  useClearNotificationsMutation,
} = notificationApiSlice;