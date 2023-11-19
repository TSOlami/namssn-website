import { apiSlice } from "./apiSlice";

const POSTS_URL = '/api/v1/users';

export const postsApiSlice = apiSlice.injectEndpoints({
	endpoints(builder) {
		return {
      // Get All Posts Query
      allPosts: builder.query({
        query(page, pageSize) {
          return {
            url: `${POSTS_URL}/posts?page=${page}&pageSize=${pageSize}`,
            method: 'GET',
          };
        },
        providesTags: ['Post'], 
      }),

      // Get Paginated Posts Query
      paginatedPosts: builder.query({
        query({ page, pageSize }) {
          return {
            url: `${POSTS_URL}/posts?page=${page}&pageSize=${pageSize}`,
            method: 'GET',
          };
        },
        providesTags: ['Post'],
      }),

      // Get a Post Query
      post: builder.query({
        query({ postId }) {
          return {
            url: `${POSTS_URL}/posts/${postId}`,
            method: 'GET',
          };
        },
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
      }),

      // Upvote Post Query
      upvotePost: builder.mutation({
        query({ postId, data }) {
          return {
            url: `${POSTS_URL}/posts/${postId}/upvote`,
            method: 'PUT',
            body: data,
          };
        },
      }),

      // Downvote Post Query
      downvotePost: builder.mutation({
        query({ postId, data }) {
          return {
            url: `${POSTS_URL}/posts/${postId}/downvote`,
            method: 'PUT',
            body: data,
          };
        },
      }),

      // Get Post Comments Query
      postComments: builder.query({
        query({ postId }) {
          return {
            url: `${POSTS_URL}/posts/${postId}/comments`,
            method: 'GET',
          };
        },
        providesTags: ['Post'],
      }),

      // Comment on Post Query
      commentPost: builder.mutation({
        query({ postId, data }) {
          return {
            url: `${POSTS_URL}/posts/${postId}/comments`,
            method: 'POST',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Update Comment Query
      updateComment: builder.mutation({
        query({ commentId, postId, data }) {
          return {
            url: `${POSTS_URL}/posts/${postId}/comments/${commentId}`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Delete Comment Query
      deleteComment: builder.mutation({
        query({ commentId, postId, data }) {
          return {
            url: `${POSTS_URL}/posts/${postId}/comments/${commentId}`,
            method: 'DELETE',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Upvote Comment Query
      upvoteComment: builder.mutation({
        query({ commentId, postId, data }) {
          return {
            url: `${POSTS_URL}/posts/${postId}/comments/${commentId}/upvote`,
            method: 'PUT',
            body: data,
          };
        },
        invalidatesTags: ['Post'],
      }),

      // Downvote Comment Query
      downvoteComment: builder.mutation({
        query({ commentId, postId, data }) {
          return {
            url: `${POSTS_URL}/posts/${postId}/comments/${commentId}/downvote`,
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
  usePostQuery,
  usePaginatedPostsQuery,
  useUserPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useUpvotePostMutation,
  useDownvotePostMutation,
  usePostCommentsQuery,
  useCommentPostMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useUpvoteCommentMutation,
  useDownvoteCommentMutation,
} = postsApiSlice;