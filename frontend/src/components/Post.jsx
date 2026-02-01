import { useEffect } from "react";
import { FaCircleCheck, FaX } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import Actions from "./Actions";
import PostComments from "./PostComments";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { formatDateToTime } from "../utils";
import {
	useUpvotePostMutation,
	useDownvotePostMutation,
	useDeletePostMutation,
	usePostCommentsQuery,
	useCommentPostMutation,
	setPosts,
} from "../redux";
import { ProfileImg } from "../assets";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { CommentListSkeleton } from "./skeletons";
import { ConfirmDialog } from "./ConfirmDialog";

const Post = ({ post, updatePostData, removePost }) => {
	const [openOptions, setopenOptions] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const handleOpenOptions = () => {
		setopenOptions(!openOptions);
	};

  // Close options menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        openOptions &&
        event.target.closest(".options-menu") === null &&
        event.target.closest(".pi-dots-icon") === null
      ) {
        setopenOptions(false);
      }
    };

    document.body.addEventListener("click", handleOutsideClick);
    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, [openOptions]);

	const postId = post?._id;
	const u_id = post?.user?._id;
	const upvotes = post?.upvotes;
	const downvotes = post?.downvotes;
	const comments = post?.comments;
	const text = post?.text;
	const image = post?.image;
	const createdAt = post?.createdAt;
	const name = post?.user?.name;
	const username = post?.user?.username;
	const avatar = post?.user?.profilePicture;
	const isVerified = post?.user?.isVerified;

	const date = new Date(createdAt);

	const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
	const [commentText, setCommentText] = useState("");
	const { data: commentsData, isLoading: isCommentsLoading, refetch: refetchComments } = usePostCommentsQuery(
		{ postId },
		{ skip: !postId || !isCommentsExpanded }
	);
	const commentsList = commentsData ?? [];
	const [commentPost] = useCommentPostMutation();

	const handleToggleComments = () => {
		setIsCommentsExpanded((prev) => !prev);
	};

	const handleSubmitComment = async () => {
		if (!commentText.trim()) return;
		try {
			await toast.promise(
				commentPost({
					postId,
					data: { text: commentText },
				}).unwrap(),
				{
					pending: "Submitting comment...",
					success: "Comment added",
					error: "Failed to add comment",
				}
			);
			setCommentText("");
			refetchComments();
		} catch {
			/* toast handled by promise */
		}
	}

	const dispatch = useDispatch();
	const [deletePost] = useDeletePostMutation();
	const handleDeletePost = async () => {
		try {
			const response = await toast.promise(
				deletePost({ postId: postId }).unwrap(),
				{
					pending: "Deleting post...",
					success: "Post deleted successfully",
					error: "Failed to delete post",
				}
			);
			if (response.message === "success") {
				removePost(postId);
			} else {
				console.error("Post deletion failed", response);
			}
		} catch (error) {
			console.error("Post deletion failed", error);
		}
		handleOpenOptions();
	};
	const { _id: userId, role } = useSelector((state) => state.auth.userInfo);
	const isUpvotedInitial = post?.upvotes.includes(userId);
	const isDownvotedInitial = post?.downvotes.includes(userId);
	const [isUpvoted, setIsUpvoted] = useState(isUpvotedInitial);
	const [isDownvoted, setIsDownvoted] = useState(isDownvotedInitial);
	const [upvotePost] = useUpvotePostMutation();
	const [downvotePost] = useDownvotePostMutation();
	const data = {
		user: { _id: userId },
	};

	const handleUpvote = async () => {
		if (isDownvoted) {
			setIsDownvoted(false);
		}

		try {
			const response = await toast.promise(
				upvotePost({ postId: postId, data: data }).unwrap(),
				{
					pending: "Upvoting...",
					success: "Upvoted!",
					error: "Upvote failed",
				}
			);

			if (response.message === "success") {
				setIsUpvoted(!isUpvoted);
				dispatch(setPosts({ ...response.post }));
				updatePostData(postId, response.post);
			} else {
				console.error("Upvote failed:", response);
			}
		} catch (error) {
			console.error("Upvote failed:", error);
		}
	};

	const handleDownvote = async () => {
		if (isUpvoted) {
			setIsUpvoted(false);
		}

		try {
			const response = await toast.promise(
				downvotePost({ postId: postId, data: {} }).unwrap(),
				{
					pending: "Downvoting...",
					success: "Downvoted!",
					error: "Downvote failed",
				}
			);

			if (response.message === "success") {
				// Toggle the downvote state
				setIsDownvoted(!isDownvoted);
				dispatch(setPosts({ ...response.post }));
				// Update the post data in Home component with the new data
				updatePostData(postId, response.post);
			} else {
				console.error("Downvote failed:", response);
			}
		} catch (error) {
			console.error("Downvote failed:", error);
		}
	};

	const [isExpanded, setIsExpanded] = useState(false);
	const handleExpand = () => {
		setIsExpanded(!isExpanded);
	};
	return (
		<div className="border-b-2 border-gray-300 p-2 pr-1 flex flex-row gap-1 sm:gap-2 h-fit min-w-[350px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] wide:w-[850px]">
			<div>
				<Link to={`/profile/${u_id}`}>
					<img
						src={avatar || ProfileImg}
						alt="avatar"
						className="profile-image-small"
					/>
				</Link>
			</div>

			<div className="flex flex-col gap-2 w-full">
				<div className="flex flex-row gap-1 lg:gap-2 items-center w-full relative">
					<Link to={`/profile/${u_id}`}>
						{" "}
						<span className="font-medium flex flex-row items-center gap-1">
							<span className="font-semibold">
								{" "}
								{name?.length > 10 ? (
									<span>{name.slice(0, 10)}... </span>
								) : (
									<span>{name}</span>
								)}
							</span>
							{isVerified && <FaCircleCheck color="#17A1FA" />}
						</span>
					</Link>
					<span>@
						{username?.length > 10 ? (
							<span>{username.slice(0, 10)}... </span>
						) : (
							<span>{username}</span>
						)}
					</span>
					<span className="text-gray-500">
						{formatDateToTime(date)}
					</span>

					{(role === "admin" || userId === u_id) && (
						<>
							<span
								className="pi-dots-icon absolute right-0 active:bg-greyish rounded-md p-2 cursor-pointer"
								onClick={(e) => { e.stopPropagation(); handleOpenOptions(); }}
							>
								<div className="cursor-pointer">
									<PiDotsThreeOutlineVerticalFill />
								</div>
							</span>
							{openOptions && (
								<div className="options-menu absolute right-0 top-10 z-20">
									<button
										onClick={() => setShowDeleteConfirm(true)}
										className="text-red-500 p-2 shadow-lg rounded-md bg-white border border-gray-200 flex items-center gap-2 w-full min-w-[120px] hover:bg-gray-50"
									>
										<MdDelete /> <span>Delete Post</span>
									</button>
								</div>
							)}
						</>
					)}
				<ConfirmDialog
					isOpen={showDeleteConfirm}
					onClose={() => setShowDeleteConfirm(false)}
					onConfirm={() => { handleOpenOptions(); handleDeletePost(); }}
					title="Delete post?"
					message="This post will be permanently deleted. This cannot be undone."
					confirmLabel="Delete Post"
				/>
				</div>

				<div className="font-roboto text-xl leading-normal">
					<div>{text}</div>
					{image && (
						<div className="post-image-container pt-2">
							<img
								src={image}
								alt="Post Image"
								className="post-image cursor-pointer "
								onClick={handleExpand}
							/>
						</div>
					)}
				</div>

				{isExpanded && (
					<motion.div
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						className="fixed inset-0 z-[10000] bg-black/50 blur-filter flex p-3"
					>
						<img
							src={image}
							className="m-auto max-h-full max-w-full"
						/>

						<button
							className="text-white text-3xl absolute right-10 top-5 bg-gray-800 p-3 rounded-lg"
							onClick={handleExpand}
						>
							<FaX />
						</button>
					</motion.div>
				)}

				<Actions
					upvotes={upvotes}
					downvotes={downvotes}
					isUpvoted={isUpvoted}
					onUpvote={handleUpvote}
					isDownvoted={isDownvoted}
					onDownvote={handleDownvote}
					comments={comments}
					postId={postId}
					onToggleComments={handleToggleComments}
					isCommentsExpanded={isCommentsExpanded}
				/>

				{isCommentsExpanded && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="mt-3 pt-3 border-t border-gray-200 min-w-0 overflow-x-hidden"
					>
						<div className="flex flex-row gap-2 items-end mb-3 min-w-0">
							<textarea
								placeholder="Write a comment..."
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSubmitComment();
									}
								}}
								className="flex-1 min-w-0 resize-none border border-gray-300 rounded-xl p-2 min-h-[44px] text-sm"
								rows={1}
							/>
							<button
								type="button"
								onClick={handleSubmitComment}
								disabled={!commentText.trim()}
								className="flex-shrink-0 p-2 rounded-xl bg-primary text-white disabled:opacity-50 hover:opacity-90"
							>
								<IoSend className="w-5 h-5" />
							</button>
						</div>
						<div className="space-y-1 max-h-80 overflow-y-auto overflow-x-hidden min-w-0">
							{isCommentsLoading ? (
								<CommentListSkeleton count={3} />
							) : commentsList?.length > 0 ? (
								commentsList.map((comment) => (
									<PostComments
										key={comment?._id}
										postId={comment?.post ?? postId}
										commentId={comment._id}
										upvotes={comment?.upvotes ?? []}
										downvotes={comment?.downvotes ?? []}
										text={comment?.text}
										createdAt={comment?.createdAt}
										u_id={comment?.user?._id}
										isVerified={comment?.user?.isVerified}
										username={comment?.user?.username}
										name={comment?.user?.name}
										image={comment?.user?.profilePicture}
									/>
								))
							) : (
								<p className="text-gray-500 text-sm py-2">No comments yet. Be the first to comment.</p>
							)}
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default Post;
