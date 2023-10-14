import { FaCircleCheck } from "react-icons/fa6";
import Actions from "./Actions";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

import { formatDateToTime } from "../utils";
import { useUpvotePostMutation, useDownvotePostMutation, useDeletePostMutation } from "../redux";

const Post = ({ isVerified, upvotes, downvotes,	comments,	text,	name,	username,	image,	createdAt, u_id, postId }) => {
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
  const handleDeletePost = async () =>{
    try {
      const response = await deletePost(postId).unwrap();
      if (response.status === "success") {
        console.log("Post deleted successfully", response);
      } else {
        console.error("Post deletion failed", response);
      }
    }
    catch (error) {
      console.error("Post deletion failed", error);
    }
    handleOpenOptions();
  }
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
      const response = await upvotePost({ postId: postId, data: data }).unwrap();
  
      if (response.message === "success") {
        // Toggle the upvote state
        setIsUpvoted(!isUpvoted);
        console.log('Upvote successful:', response);
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
      const response = await downvotePost({ postId: postId, data: {} }).unwrap();
  
      if (response.message === "success") {
        // Toggle the downvote state
        setIsDownvoted(!isDownvoted);
      } else {
        console.error('Downvote failed:', response);
      }
    } catch (error) {
      console.error('Downvote failed:', error);
    }
  };
  
	return (
		<div className="border-b-2 border-gray-300 p-4 flex flex-row gap-2 h-fit min-w-[400px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px]">
			<div>
				<Link to={`/profile/${u_id}`}>
					<img src={image} alt="avatar" className="cursor-pointer" />
				</Link>
			</div>

			<div className="flex flex-col gap-2 w-full">
				<div className="flex flex-row gap-2 lg:gap-2 items-center w-full relative">
					<Link to={`/profile/${u_id}`}>
						{" "}
						{/* Wrap the user's name in a Link */}
						<span className="font-medium flex flex-row items-center gap-2">
							<span className="font-semibold">{name}</span>
							{isVerified && <FaCircleCheck color="#17A1FA" />}
						</span>
					</Link>
					<span>@{username}</span>
					<span className="text-gray-500">
                    {formatDateToTime(date)}
					</span>

					<span
						className="absolute right-0 active:bg-greyish rounded-md p-2"
						onClick={handleOpenOptions}
					>
						<PiDotsThreeOutlineVerticalFill />
					</span>
					{openOptions && (
						<button onClick={handleDeletePost} className="text-red-500 p-2 shadow-lg absolute bg-white right-0 top-6 flex items-center gap-2">
							<MdDelete /> <span>Delete Post</span>
						</button>
					)}
				</div>

				{/* Post content goes here */}
				<div className="body-text" onClick={routeToComments}>{text}</div>

				{/* Post actions */}

				<Actions
					upvotes={upvotes}
					downvotes={downvotes}
					comments={comments}
					isUpvoted={isUpvoted}
					onUpvote={handleUpvote}
					isDownvoted={isDownvoted}
					onDownvote={handleDownvote}
                    postId={postId}
				/>
			</div>
		</div>
	);
};

export default Post;