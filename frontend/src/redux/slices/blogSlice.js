import { apiSlice } from "./apiSlice";

const BLOG_URL = "/api/v1/users";

export const blogApiSlice = apiSlice.injectEndpoints({
	endpoints(builder) {
		return {

      // Get User Blogs Query
      userBlogs: builder.query({
        query({ _id }) {
          return {
            url: `${BLOG_URL}/blog/${_id}`,
            method: 'GET',
          };
        },
        providesTags: ['Blog'],
      }),

      // Upvote Blog Query
      upvoteBlog: builder.mutation({
        query(data) {
          return {
            url: `${BLOG_URL}/blog/upvote`,
            method: 'PUT',
            body: data,
          };
        },
      }),

      // Downvote Blog Query
      downvoteBlog: builder.mutation({
        query(data) {
          return {
            url: `${BLOG_URL}/blog/downvote`,
            method: 'PUT',
            body: data,
          };
        },
      }),

      // Comment on Blog Query
      commentBlog: builder.mutation({
        query(data) {
          return {
            url: `${BLOG_URL}/blog/comment`,
            method: 'PUT',
            body: data,
          };
        },
      }),

      // Upvote Blog Comment Query
      upvoteBlogComment: builder.mutation({
        query(data) {
          return {
            url: `${BLOG_URL}/blog/comment/upvote`,
            method: 'PUT',
            body: data,
          };
        },
      }),

      // Downvote Blog Comment Query
      downvoteBlogComment: builder.mutation({
        query(data) {
          return {
            url: `${BLOG_URL}/blog/comment/downvote`,
            method: 'PUT',
            body: data,
          };
        },
      }),

      // Delete Blog Comment Query
      deleteBlogComment: builder.mutation({
        query(data) {
          return {
            url: `${BLOG_URL}/blog/comment`,
            method: 'DELETE',
            body: data,
          };
        },
      }),
		};
	},
});

export const {
  useAllBlogsQuery,
  useUserBlogsQuery,
  useDeleteBlogMutation,
  useUpvoteBlogMutation,
  useDownvoteBlogMutation,
  useCommentBlogMutation,
  useUpvoteBlogCommentMutation,
  useDownvoteBlogCommentMutation,
  useDeleteBlogCommentMutation,
} = blogApiSlice;
