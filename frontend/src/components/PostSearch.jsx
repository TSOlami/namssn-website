import { FaCircleCheck } from "react-icons/fa6";
import Actions from "./Actions";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { formatDateToTime } from "../utils";
import {
	useUpvotePostMutation,
	useDownvotePostMutation,
	useDeletePostMutation,
} from "../redux";
import { ProfileImg } from "../assets";
import { ConfirmDialog } from "./ConfirmDialog";

const PostSearch = ({
	upvotes,
	downvotes,
	isVerified,
	image,
	text,
	name,
	username,
	avatar,
	createdAt,
	u_id,
	postId,
}) => {
	const userInfo = useSelector((state) => state.auth.userInfo);
	const userId = userInfo?._id;
	const role = userInfo?.role;
	const [openOptions, setopenOptions] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const canDelete = userId && (role === "admin" || userId === u_id);

	const handleOpenOptions = () => {
		setopenOptions(!openOptions);
	};

	const date = new Date(createdAt);

	// Post deletion
	const [deletePost] = useDeletePostMutation();
	const handleDeletePost = async () => {
		try {
			toast.promise(deletePost({ postId: postId }).unwrap(), {
				pending: "Deleting post...",
				success: "Post deleted successfully",
			});
			
		} catch (error) {
			toast.error(error?.error?.response?.data?.message || error?.data?.message || error?.error)
		}
		handleOpenOptions();
	};
	const [isUpvoted, setIsUpvoted] = useState(false);
	const [isDownvoted, setIsDownvoted] = useState(false);
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
			const response = toast.promise(upvotePost({ postId, data }).unwrap(), {
				pending: "Upvoting post...",
				success: "Post upvoted successfully",
				error: "Failed to upvote post",
			});

			if (response.message === "success") {
				setIsUpvoted(!isUpvoted);
			}
		} catch {
			/* ignore */
		}
	};

	const handleDownvote = async () => {
		if (isUpvoted) {
			setIsUpvoted(false);
		}

		try {
			// Perform the downvote logic to send an API call to the server
			const response = toast.promise(downvotePost({
				postId: postId,
				data: {},
			}).unwrap(), {
				pending: "Downvoting post...",
				success: "Post downvoted successfully",
				error: "Failed to downvote post",
			});

			if (response.message === "success") {
				// Toggle the downvote state
				setIsDownvoted(!isDownvoted);
			} else {
				console.error("Downvote failed:", response);
			}
		} catch (error) {
			console.error("Downvote failed:", error);
		}
	};

	return (
		<div className="w-[100%]">
			<div className="border-b-2 border-gray-300 p-4 flex flex-row gap-2 h-fit min-w-[100%] md:min-w-[100%] lg:min-w-[100%] xl:w-[100%] wide:w-[100%]">
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
					<div className="flex flex-row gap-2 lg:gap-2 items-center w-full relative">
						<Link to={`/profile/${u_id}`}>
							{" "}
							<span className="font-medium flex flex-row items-center gap-2">
								<span className="font-semibold">{name?.length > 10 ? (
									<span>{name.slice(0, 10)}... </span>
								) : (
									<span>{name}</span>
								)}</span>
								{isVerified && (
									<FaCircleCheck color="#17A1FA" />
								)}
							</span>
						</Link>
						<span>@{username?.length > 10 ? (
							<span>{username.slice(0, 10)}... </span>
						) : (
							<span>{username}</span>
						)}</span>
						<span className="text-gray-500">
							{formatDateToTime(date)}
						</span>

						{canDelete && (
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
					</div>
					<ConfirmDialog
						isOpen={showDeleteConfirm}
						onClose={() => setShowDeleteConfirm(false)}
						onConfirm={() => { handleOpenOptions(); handleDeletePost(); }}
						title="Delete post?"
						message="This post will be permanently deleted. This cannot be undone."
						confirmLabel="Delete Post"
					/>

					<div className="body-text">
						{text}
						{image && (
							<div className="post-image-container pt-2">
								<img
									src={image}
									alt="Post Image"
									className="post-image"
								/>
							</div>
						)}
					</div>

					<Actions
						upvotes={upvotes}
						downvotes={downvotes}
						isUpvoted={isUpvoted}
						onUpvote={handleUpvote}
						isDownvoted={isDownvoted}
						onDownvote={handleDownvote}
						postId={postId}
					/>
				</div>
			</div>
		</div>
	);
};

export default PostSearch;
