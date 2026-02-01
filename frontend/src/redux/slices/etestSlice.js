import { apiSlice } from './apiSlice';

const USERS_URL = '/api/v1/users';

export const etestApiSlice = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getCourses: builder.query({
        query(params = {}) {
          const searchParams = new URLSearchParams();
          if (params.level) searchParams.set('level', params.level);
          const qs = searchParams.toString();
          return {
            url: `${USERS_URL}/etest/courses${qs ? `?${qs}` : ''}`,
            method: 'GET',
          };
        },
        providesTags: ['ETest'],
      }),

      getTestsByCourse: builder.query({
        query(courseId) {
          return {
            url: `${USERS_URL}/etest/courses/${courseId}/tests`,
            method: 'GET',
          };
        },
        providesTags: (result, error, courseId) => [{ type: 'ETest', id: `course-${courseId}` }],
      }),

      getTestById: builder.query({
        query(testId) {
          return {
            url: `${USERS_URL}/etest/tests/${testId}`,
            method: 'GET',
          };
        },
        providesTags: (result, error, testId) => [{ type: 'ETest', id: `test-${testId}` }],
      }),

      submitAttempt: builder.mutation({
        query({ testId, answers, timeSpentSeconds }) {
          return {
            url: `${USERS_URL}/etest/tests/${testId}/attempt`,
            method: 'POST',
            body: { answers, timeSpentSeconds },
          };
        },
        invalidatesTags: ['ETest'],
      }),

      getUserAttempts: builder.query({
        query(params = {}) {
          const searchParams = new URLSearchParams();
          if (params.testId) searchParams.set('testId', params.testId);
          const qs = searchParams.toString();
          return {
            url: `${USERS_URL}/etest/attempts${qs ? `?${qs}` : ''}`,
            method: 'GET',
          };
        },
        providesTags: ['ETest'],
      }),

      getAttemptById: builder.query({
        query(attemptId) {
          return {
            url: `${USERS_URL}/etest/attempts/${attemptId}`,
            method: 'GET',
          };
        },
        providesTags: (result, error, attemptId) => [{ type: 'ETest', id: `attempt-${attemptId}` }],
      }),
    };
  },
});

export const {
  useGetCoursesQuery,
  useGetTestsByCourseQuery,
  useGetTestByIdQuery,
  useSubmitAttemptMutation,
  useGetUserAttemptsQuery,
  useGetAttemptByIdQuery,
} = etestApiSlice;
