import { useParams } from "react-router-dom";
import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { motion } from "framer-motion";

import {
	AnnouncementContainer,
	HeaderComponent,
	Post,
	Sidebar,
	PostComments,
} from "../components";
import { useCommentPostMutation, usePostCommentsQuery, usePostQuery } from "../redux";
import { PostSkeleton, CommentListSkeleton } from "../components/skeletons";
import { toast } from "react-toastify";

const Comments = () => {
	const { postId } = useParams();

	// Use the usePostCommentsQuery hook to fetch comments for the post
	const { data: comments, isLoading: isCommentsLoading } = usePostCommentsQuery({
		postId: postId,
	});

	// Use the usePostQuery hook to fetch the post
	const { data: post, isLoading: isPostLoading  } = usePostQuery({
		postId: postId,
	});

	const [commentPost] = useCommentPostMutation();

	// Use useSelector to select the 'auth' slice of the state
	// const auth = useSelector((state) => state.auth);

	// Find the post with a matching _id within the 'auth.posts' array
	// const post = auth.posts?.find((p) => p._id === postId);

	// Use the usePostCommentsQuery hook to fetch comments for the post
	const [commentText, setCommentText] = useState("");

	// const { data: post } = usePostCommentsQuery(postId);
	// Handle comment submission
	const handleCommentSubmit = async () => {
		try {
			setCommentText("");
			toast.promise(commentPost({
				postId: postId,
				data: {
					text: commentText,
				},
			}), {
				pending: "Submitting comment...",
				success: "Comment submitted successfully",
			})
		} catch (err) {
			toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
		}
	};
	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			className="flex flex-row w-full"
		>
			<Sidebar />

			<div className="flex flex-col flex-1 relative">
				<HeaderComponent title="Post" back/>
				
				{/* Post content or skeleton */}
				<div className="w-full">
					{isPostLoading ? (
						<PostSkeleton />
					) : !post ? (
						<p className="text-center mt-28">This post is unavailable</p>
					) : (
						<Post
							key={post?._id}
							post={post}
						/>
					)}
				</div>

				{/* Add comment */}
				<div className="flex flex-row fixed bottom-3 lg:left-[250px] xl:w-[700px] lg:w-[500px] md:left-[2px] md:w-[450px] w-screen left-0 wide:w-[850px]">
					<textarea
						name="comment"
						placeholder="Add comment"
						id=""
						value={commentText}
						required
						onChange={(e) => setCommentText(e.target.value)}
						className="resize-none border-2 border-gray-40 h-[47px] w-full p-2 rounded-xl mr-1 m-2 "
					></textarea>

					<div
						onClick={() => {
							// Handle comment submission here
							handleCommentSubmit();
						}}
						className="p-2 m-2 bg-primary rounded-xl text-white flex items-center text-2xl hover:opacity-80"
					>
						<IoSend />
					</div>
				</div>
				{/* Comments section with skeleton */}
				<div className="pb-12">
				{isCommentsLoading ? (
					<CommentListSkeleton count={4} />
				) : comments && comments?.length > 0 ? (
					comments?.map((comment) => {
						return (
							<PostComments
								key={comment?._id}
								postId={comment?.post}
								commentId={comment._id}
								upvotes={comment?.upvotes}
								downvotes={comment?.downvotes}
								text={comment?.text}
								createdAt={comment?.createdAt}
								u_id={comment?.user._id}
								isVerified={comment.user.isVerified}
								username={comment.user.username}
								name={comment.user.name}
								image={comment.user.profilePicture}
							/>
						);
					})
				) : (
					<div className="text-center mt-4 p-4 pb-40 text-gray-500">
						No comments to display.
					</div>
				)}
				</div>
			</div>

			<AnnouncementContainer />
		</motion.div>
	);
};

export default Comments;
