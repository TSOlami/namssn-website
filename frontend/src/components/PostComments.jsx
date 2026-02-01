import { FaCircleCheck } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import {
	useDeleteCommentMutation,
	useUpvoteCommentMutation,
	useDownvoteCommentMutation,
} from "../redux";
import { formatDateToTime } from "../utils";
import { ProfileImg } from "../assets";
import { CommentActions, ConfirmDialog } from "../components";
import { toast } from "react-toastify";

const PostComments = ({
	isVerified,
	text,
	name,
	username,
	image,
	createdAt,
	u_id,
	postId,
	commentId,
	upvotes,
	downvotes,
}) => {
	const [openOptions, setopenOptions] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const handleOpenOptions = () => {
		setopenOptions(!openOptions);
	};

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (
				openOptions &&
				!event.target.closest(".options-menu") &&
				!event.target.closest(".pi-dots-icon")
			) {
				setopenOptions(false);
			}
		};
		document.body.addEventListener("click", handleOutsideClick);
		return () => document.body.removeEventListener("click", handleOutsideClick);
	}, [openOptions]);

	const { _id: userId, role } = useSelector((state) => state.auth.userInfo);

	const date = new Date(createdAt);

	// Check if the user has upvoted or downvoted the post
	const initialUpvoteStatus = upvotes.includes(userId);
	const initialDownvoteStatus = downvotes.includes(userId);

	// State for keeping track of upvotes and downvotes status
	const [isUpvoted, setIsUpvoted] = useState(initialUpvoteStatus);
	const [isDownvoted, setIsDownvoted] = useState(initialDownvoteStatus);

	// Post deletion
	const [deleteComment] = useDeleteCommentMutation();
	const [upvoteComment] = useUpvoteCommentMutation();
	const [downvoteComment] = useDownvoteCommentMutation();

	const handleUpvote = async () => {
		if (isDownvoted) {
			setIsDownvoted(false);
		}

		try {
			const response = await toast.promise(
				upvoteComment({ commentId, postId }).unwrap(),
				{
					pending: "Upvoting comment...",
					success: "Comment upvoted successfully",
					error: "Failed to upvote comment",
				}
			);

			if (response.message === "success") {
				setIsUpvoted(!isUpvoted);
			}
		} catch (error) {
			console.error("Comment upvote failed", error);
		}
	};

	// Handle comment downvote
	const handleDownvote = async () => {
		// Add logic to prevent the user from upvoting and downvoting at the same time
		if (isUpvoted) {
			setIsUpvoted(false);
		}

		try {
			const response = await toast.promise(
				downvoteComment({ commentId, postId }).unwrap(),
				{
					pending: "Downvoting comment...",
					success: "Comment downvoted successfully",
					error: "Failed to downvote comment",
				}
			);
			if (response.message === "success") {
				setIsDownvoted(!isDownvoted);
			}
		} catch (error) {
			console.error("Comment downvote failed", error);
		}
	};

	const handleDeleteComment = async () => {
		try {
			toast.promise(await deleteComment({
				commentId,
				postId,
			}).unwrap(),
			{
				pending: "Deleting comment...",
				success: "Comment deleted successfully",
			});
			
		} catch (error) {
			toast.error(error?.error?.response?.data?.message || error?.data?.message || error?.error)
			console.error("Comment deletion failed", error);
		}
		handleOpenOptions();
	};

	return (
		<div className="border-gray-300 p-4 flex flex-row gap-2 h-fit min-w-0 max-w-full pl:15 md:pl-24 m-2">
			<div className="flex-shrink-0">
				<Link to={`/profile/${u_id}`}>
					<img
						src={image || ProfileImg}
						alt="avatar"
						className="profile-image-small"
					/>
				</Link>
			</div>

			<div className="flex flex-col gap-2 min-w-0 flex-1">
				<div className="flex flex-row gap-2 lg:gap-2 items-center w-full relative">
					<Link to={`/profile/${u_id}`}>
						{" "}
						<span className="font-medium flex flex-row items-center gap-2">
							<span className="font-semibold">
								{name.length > 10 ? (
									<span>{name.slice(0, 10)}... </span>
								) : (
									<span>{name}</span>
								)}
							</span>
							{isVerified && <FaCircleCheck color="#17A1FA" />}
						</span>
					</Link>
					<span>
						@{" "}
						{username.length > 10 ? (
							<span>{username.slice(0, 10)}... </span>
						) : (
							<span>{username}</span>
						)}
					</span>
					<span className="text-gray-500 ml-1">
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
										className="text-red-500 p-2 shadow-lg rounded-md bg-white border border-gray-200 flex items-center gap-2 w-full min-w-[100px] hover:bg-gray-50"
									>
										<MdDelete /> <span>Delete</span>
									</button>
								</div>
							)}
						</>
					)}
				</div>
				<ConfirmDialog
					isOpen={showDeleteConfirm}
					onClose={() => setShowDeleteConfirm(false)}
					onConfirm={() => { handleOpenOptions(); handleDeleteComment(); }}
					title="Delete comment?"
					message="This comment will be permanently deleted. This cannot be undone."
					confirmLabel="Delete"
				/>

				<div className="body-text break-words min-w-0">{text}</div>

				<CommentActions
					upvotes={upvotes}
					downvotes={downvotes}
					onUpvote={handleUpvote}
					onDownvote={handleDownvote}
					postId={postId}
					isUpvoted={isUpvoted}
					isDownvoted={isDownvoted}
				/>
			</div>
		</div>
	);
};

export default PostComments;
