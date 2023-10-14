import { FaCircleCheck } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";

import { useDeletePostMutation } from "../redux";

const PostComments = ({
	isVerified,
	text,
	name,
	username,
	image,
	createdAt,
	updatedAt,
	u_id,
	postId,
}) => {
	const [openOptions, setopenOptions] = useState(false);
	const handleOpenOptions = () => {
		setopenOptions(!openOptions);
	};

  const date = updatedAt ? new Date(updatedAt) : new Date(createdAt);

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



	return (
		<div className="border-gray-300 p-4 flex flex-row gap-2 h-fit min-w-[400px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] pl:15 md:pl-24 m-2">
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
					<span className="text-gray-500 ml-3">{formatDate(date)}</span>

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
				<div className="body-text">{text}</div>

			</div>
		</div>
	);
};

export default PostComments;

// Helper function to format the date as "Month Day, Year, Hour:Minute AM/PM"
function formatDate(date) {
	if (!date) {
		return "";
	}

	const options = {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	};

	return date.toLocaleDateString(undefined, options);
}

