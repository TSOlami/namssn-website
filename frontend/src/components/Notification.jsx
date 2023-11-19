import { useNavigate } from "react-router-dom";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import { FaCircleCheck, FaRegComment } from "react-icons/fa6";

import { ProfileImg } from "../assets";
import { formatDateToTime } from "../utils";
import { useMarkNotificationsAsSeenMutation } from "../redux";

const Notification = ({
	notificationId,
	upvote,
	downvote,
	comment,
	name,
	avatar,
	content,
	isVerified,
	username,
	post,
	createdAt,
	seen,
}) => {
	// Use this to navigate to the post page or comment page
	const navigate = useNavigate();

	// Use this to mark the notification as seen
	const [markNotificationsAsSeen] = useMarkNotificationsAsSeenMutation();

	const handleOpenNotification = () => {
		if (post) {
			// Mark the notification as seen
			markNotificationsAsSeen(notificationId);

			// Navigate to the post page	
			navigate(`/comments/${post}`);
		} 
	};

	const date = new Date(createdAt);
	return (
		<div className={`border-b-2 border-gray-300 p-4 flex flex-row gap-2 min-w-[400px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] ${seen ? '' : 'bg-gray-100'}`}>
			<div className="text-xl">
				{upvote && <BiUpvote color="#17A1FA" />}
				{downvote && <BiDownvote color="red"/>}
				{comment && <FaRegComment />}
			</div>
			<div className="flex flex-col">
				<div>
					<img src={avatar || ProfileImg} alt="" className="profile-image-small" />
				</div>
				<div className="flex flex-row gap-2 flex-wrap">
					<span className="font-semibold inline-flex flex-row items-center gap-2">
						{name}
						{isVerified && <FaCircleCheck color="#17A1FA" />}
						<span className="text-gray-500">
						{formatDateToTime(date)}
					</span>
					</span>
					{comment && <span>@{username}</span>}
					<span onClick={handleOpenNotification} className="cursor-pointer">
						{/* {upvote && "upvoted your post"}
						{downvote && "downvoted your post"}
						{comment && "commented on your post"} */}
						{content}
					</span>
				</div>
				{/* <div className="pt-2">{content}</div> */}
				{/* {comment && <Actions/>} */}
			</div>
		</div>
	);
};

export default Notification;
