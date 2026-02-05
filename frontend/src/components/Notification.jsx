import { useNavigate, useLocation } from "react-router-dom";
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
	tBUser,
	name,
	avatar,
	content,
	isVerified,
	username,
	post,
	createdAt,
	seen,
}) => {
	const navigate = useNavigate();
	const location = useLocation();

	// Use this to mark the notification as seen
	const [markNotificationsAsSeen] = useMarkNotificationsAsSeenMutation();

	const handleOpenNotification = () => {
		// Always mark as seen when user opens the notification
		if (notificationId) {
			markNotificationsAsSeen(notificationId);
		}

		// Deep-link to the related post if available
		if (post) {
			const params = new URLSearchParams(location.search);
			params.set("postId", post);
			navigate(`/home?${params.toString()}`);
		}
	};

	const goToProfile = (e) => {
		e.stopPropagation();
		navigate(`/profile/${tBUser}`);
	};

	const date = new Date(createdAt);
	return (
		<div
			onClick={handleOpenNotification}
			className={`border-b-2 border-gray-300 p-4 flex flex-row gap-2 min-w-[400px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] cursor-pointer hover:bg-gray-50 ${seen ? "" : "bg-gray-100"}`}
		>
			<div className="text-xl">
				{upvote && <BiUpvote color="#17A1FA" />}
				{downvote && <BiDownvote color="red"/>}
				{comment && <FaRegComment />}
			</div>
			<div className="flex flex-col">
				<div onClick={goToProfile}>
					<img src={avatar || ProfileImg} alt="" className="profile-image-small" />
				</div>
				<div className="flex flex-row gap-2 flex-wrap">
					<span onClick={goToProfile} className="font-semibold inline-flex flex-row items-center gap-2">
						{name}
						{isVerified && <FaCircleCheck color="#17A1FA" />}
					</span>
					<span className="text-gray-500">
					{formatDateToTime(date)}
					</span>
					{comment && <span>@{username}</span>}
					<span>{content}</span>
				</div>
				{/* <div className="pt-2">{content}</div> */}
				{/* {comment && <Actions/>} */}
			</div>
		</div>
	);
};

export default Notification;
