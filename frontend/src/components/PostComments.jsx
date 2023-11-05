import { FaCircleCheck } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";

import { useDeleteCommentMutation, useUpvoteCommentMutation, useDownvoteCommentMutation } from "../redux";
import { formatDateToTime } from "../utils";
import { ProfileImg } from "../assets";
import { CommentActions } from "../components";
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
  const handleOpenOptions = () => {
      setopenOptions(!openOptions);
  };
  
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
  
  // Handle comment upvote
  const handleUpvote = async () => {
    // Add logic to prevent the user from upvoting and downvoting at the same time
		if (isDownvoted) {
			setIsDownvoted(false);
		}
    
    try {
        const response = await toast.promise(
          upvoteComment({commentId, postId}).unwrap(),
          {
            pending: "Upvoting comment...",
            success: "Comment upvoted successfully",
            error: "Failed to upvote comment",
          }
        );
        
        if (response.message === 'success') {
          // Toggle the upvote state
          setIsUpvoted(!isUpvoted);
        }
      }
      catch (error) {
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
        downvoteComment({commentId, postId}).unwrap(),
        {
          pending: "Downvoting comment...",
          success: "Comment downvoted successfully",
          error: "Failed to downvote comment",
        }
      );
      if (response.message === 'success') {
        console.log("Comment downvoted successfully", response);

        // Toggle the downvote state
        setIsDownvoted(!isDownvoted);
      }} catch (error) {
        console.error("Comment downvote failed", error);
      }
  };

  const handleDeleteComment = async () =>{
    try {
      const response = await deleteComment({commentId, postId}).unwrap();
      if (response.message === 'success') {
        console.log("Comment deleted successfully", response);
      } else {
        console.error("Comment deletion failed", response);
      }
    }
    catch (error) {
      console.error("Comment deletion failed", error);
    }
    handleOpenOptions();
  }



    return (
        <div className="border-gray-300 p-4 flex flex-row gap-2 h-fit min-w-[400px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] pl:15 md:pl-24 m-2">
            <div>
                <Link to={`/profile/${u_id}`}>
                    <img src={image || ProfileImg} alt="avatar" className="profile-image-small" />
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
                    <span className="text-gray-500 ml-3">{formatDateToTime(date)}</span>

                    <span
                        className="absolute right-0 active:bg-greyish rounded-md p-2"
                        onClick={handleOpenOptions}
                    >
                        <div className="cursor-pointer">{role === "admin" || userId === u_id ?   <PiDotsThreeOutlineVerticalFill /> : null}
                        </div>
                    </span>
                    {openOptions && (
                        <button onClick={handleDeleteComment} className="text-red-500 p-2 shadow-lg absolute bg-white right-0 top-6 flex items-center gap-2">
                            <MdDelete /> <span>Delete</span>
                        </button>
                    )}
                </div>

                {/* Post content goes here */}
                <div className="body-text">{text}</div>

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
