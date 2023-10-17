import { FaCircleCheck } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDeleteCommentMutation, useUpvoteCommentMutation, useDownvoteCommentMutation } from "../redux";
// import { formatDateToTime } from "../utils";
import { ProfileImg } from "../assets";
import { CommentActions } from "../components";

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

  const date = new Date(createdAt);

  // Post deletion
  const [deleteComment] = useDeleteCommentMutation();
  const [upvoteComment] = useUpvoteCommentMutation();
  const [downvoteComment] = useDownvoteCommentMutation();
  
  // Handle comment upvote
  const handleUpvote = async () => {
    try {
      const response = await upvoteComment({commentId, postId}).unwrap();
      if (response.message === 'success') {
        console.log("Comment upvoted successfully", response);
      } else {
        console.error("Comment upvote failed", response);
      }
    }
    catch (error) {
      console.error("Comment upvote failed", error);
    }
  };

  // Handle comment downvote
  const handleDownvote = async () => {
    try {
      const response = await downvoteComment({commentId, postId}).unwrap();
      if (response.message === 'success') {
        console.log("Comment downvoted successfully", response);
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
                    {/* <span className="text-gray-500 ml-3">{formatDateToTime(date)}</span> */}

                    <span
                        className="absolute right-0 active:bg-greyish rounded-md p-2"
                        onClick={handleOpenOptions}
                    >
                        <div className="cursor-pointer"><PiDotsThreeOutlineVerticalFill />
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
                />

            </div>
        </div>
    );
};

export default PostComments;
