import { apiSlice } from "./apiSlice";

const POSTS_URL = '/api/v1/users';

export const postsApiSlice = apiSlice.injectEndpoints({
	endpoints(builder) {
		return {
      // Get All Posts Query
      allPosts: builder.query({
        query() {
          return {
            url: `${POSTS_URL}/posts`,
            method: 'GET',
          };
        },
        providesTags: ['Post'], 
      }),

      // Get User Posts Query
      userPosts: builder.query({
        query({ _id }) {
          return {
            url: `${POSTS_URL}/post/${_id}`,
            method: 'GET',
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Create Post Query
      createPost: builder.mutation({
        query(data) {
          return {
            url: `${POSTS_URL}/post`,
            method: 'POST',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Update Post Query
      updatePost: builder.mutation({
        query(data) {
          return {
            url: `${POSTS_URL}/post`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Delete Post Query
      deletePost: builder.mutation({
        query(data) {
          return {
            url: `${POSTS_URL}/post`,
            method: 'DELETE',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Upvote Post Query
      upvotePost: builder.mutation({
        query(data) {
          return {
            url: `${POSTS_URL}/post/upvote`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Downvote Post Query
      downvotePost: builder.mutation({
        query(data) {
          return {
            url: `${POSTS_URL}/post/downvote`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Comment on Post Query
      commentPost: builder.mutation({
        query(data) {
          return {
            url: `${POSTS_URL}/post/comment`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Delete Comment Query
      deleteComment: builder.mutation({
        query(data) {
          return {
            url: `${POSTS_URL}/post/comment`,
            method: 'DELETE',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Upvote Comment Query
      upvoteComment: builder.mutation({
        query(data) {
          return {
            url: `${POSTS_URL}/post/comment/upvote`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Downvote Comment Query
      downvoteComment: builder.mutation({
        query(data) {
          return {
            url: `${POSTS_URL}/post/comment/downvote`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),
		};
	},
});

export const {
  useAllPostsQuery,
  useUserPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useUpvotePostMutation,
  useDownvotePostMutation,
  useCommentPostMutation,
  useDeleteCommentMutation,
  useUpvoteCommentMutation,
  useDownvoteCommentMutation,
} = postsApiSlice;