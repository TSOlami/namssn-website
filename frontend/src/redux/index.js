import { setCredentials, setPosts } from "./slices/authSlice";
import { 
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useUpdateUserMutation,
	useGetUserQuery } from './slices/usersApiSlice';
import { 
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
	useDownvoteCommentMutation } from './slices/postSlice';
import {
  useAllBlogsQuery,
  useUserBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUpvoteBlogMutation,
  useDownvoteBlogMutation,
  useCommentBlogMutation,
  useUpvoteBlogCommentMutation,
  useDownvoteBlogCommentMutation,
  useDeleteBlogCommentMutation,
} from './slices/blogSlice';

import { 
	useAllAdminPaymentsQuery,
	useCreateAdminPaymentMutation,
	useUpdateAdminPaymentMutation,
	useDeleteAdminPaymentMutation
 } from './slices/paymentSlice'

export { 
		useLoginMutation,
		useLogoutMutation, 
		useRegisterMutation,
		useUpdateUserMutation,
		useGetUserQuery,
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
	useAllBlogsQuery,
	useUserBlogsQuery,
	useCreateBlogMutation,
	useUpdateBlogMutation,
	useDeleteBlogMutation,
	useUpvoteBlogMutation,
	useDownvoteBlogMutation,
	useCommentBlogMutation,
	useUpvoteBlogCommentMutation,
	useDownvoteBlogCommentMutation,
	useDeleteBlogCommentMutation,
	useAllAdminPaymentsQuery,
	useCreateAdminPaymentMutation,
	useUpdateAdminPaymentMutation,
	useDeleteAdminPaymentMutation,
	setCredentials,
	setPosts, }
