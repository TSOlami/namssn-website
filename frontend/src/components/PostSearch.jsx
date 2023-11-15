import { FaCircleCheck } from "react-icons/fa6";
import Actions from "./Actions";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
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
	const [openOptions, setopenOptions] = useState(false);

	const handleOpenOptions = () => {
		setopenOptions(!openOptions);
	};

	const navigate = useNavigate();
	const routeToComments = () => {
		navigate(`/comments/${postId}`);
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
			toast.error("Post deletion failed");
			console.error("Post deletion failed", error);
		}
		handleOpenOptions();
	};
	// Get the user ID from the redux store
	const { _id: userId } = useSelector((state) => state.auth.userInfo);

	// Add a state to keep track of the upvote and downvote status
	const [isUpvoted, setIsUpvoted] = useState(false);
	const [isDownvoted, setIsDownvoted] = useState(false);

	// Add the upvote and downvote mutations
	const [upvotePost] = useUpvotePostMutation();
	const [downvotePost] = useDownvotePostMutation();

	// Create a data object to pass user details to the mutation
	const data = {
		user: { _id: userId },
	};

	// Function to handle the upvote action
	const handleUpvote = async () => {
		// Add logic to prevent the user from upvoting and downvoting at the same time
		if (isDownvoted) {
			setIsDownvoted(false);
		}

		try {
			// Perform the upvote logic to send an API call to the server
			const response = toast.promise(upvotePost({ postId, data }).unwrap(), {
				pending: "Upvoting post...",
				success: "Post upvoted successfully",
				error: "Failed to upvote post",
			});

			if (response.message === "success") {
				// Toggle the upvote state
				setIsUpvoted(!isUpvoted);
			} else {
				// console.error('Upvote failed:', response);
			}
		} catch (error) {
			// console.error('Upvote failed:', error);
		}
	};

	// Function to handle the downvote action
	const handleDownvote = async () => {
		// Add logic to prevent the user from upvoting and downvoting at the same time
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
							{/* Wrap the user's name in a Link */}
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

						<span
							className="absolute right-0 active:bg-greyish rounded-md p-2 cursor-pointer"
							onClick={handleOpenOptions}
						>
							<div className="cursor-pointer">
								<PiDotsThreeOutlineVerticalFill />
							</div>
						</span>
						{openOptions && (
							<button
								onClick={handleDeletePost}
								className="text-red-500 p-2 shadow-lg absolute bg-white right-0 top-6 flex items-center gap-2"
							>
								<MdDelete /> <span>Delete Post</span>
							</button>
						)}
					</div>

					{/* Post content goes here */}
					<div className="body-text " onClick={routeToComments}>
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

					{/* Post actions */}

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
