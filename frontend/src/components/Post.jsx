import { FaCircleCheck } from "react-icons/fa6";
import Actions from "./Actions";
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi'
import { useNavigate } from "react-router-dom";

const Post = ({ isVerified, upvotes, downvotes, comments, text, name, username, image, createdAt, updatedAt, u_id }) => {
	const date = updatedAt ? new Date(updatedAt) : new Date(createdAt);
	const navigate = useNavigate()
	const handleViewProfile = ()=> {
		navigate('/user-profile')
	}
	

	return (
		<div className="border-b-2 border-gray-300 p-4 flex flex-row gap-2 h-fit min-w-[400px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px]">
			<div>
				<img src={image} alt="avatar" className="cursor-pointer" onClick={handleViewProfile}/>
			</div>

			<div className="flex flex-col gap-2 w-full">
				<div className="flex flex-row gap-2 lg:gap-5 items-center w-full relative">
					<span className="font-medium flex flex-row items-center gap-2">
						<span className="font-semibold">{name}</span>
                        {isVerified && <FaCircleCheck color="#17A1FA" />}
					</span>
					<span>@{username}</span>
					<span className="text-gray-500">
            {formatDate(date)}
					</span>

					<span className="absolute right-0">
						<PiDotsThreeOutlineVerticalFill/>
					</span>

				</div>

				{/* Post content goes here */}
				<div className="body-text">{text}</div>

				{/* Post actions */}

				<Actions
					upvotes={upvotes}
					downvotes={downvotes}
					comments={comments}
					/>
			</div>
		</div>
	);
};

export default Post;

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