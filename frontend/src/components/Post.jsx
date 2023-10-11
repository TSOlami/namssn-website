import { FaCircleCheck } from "react-icons/fa6";
import Actions from "./Actions";

const Post = ({ isVerified, upvotes, downvotes, comments, text, name, username, image, createdAt, updatedAt }) => {
	const date = updatedAt ? new Date(updatedAt) : new Date(createdAt);

	return (
		<div className="border-b-2 border-gray-300 p-4 flex flex-row gap-2 h-fit min-w-[400px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px]">
			<div>
				<img src={image} alt="avatar" />
			</div>

			<div className="flex flex-col gap-2 w-full">
				<div className="flex flex-row gap-2 lg:gap-5">
					<span className="font-semibold flex flex-row items-center gap-2">
						{name}
                        {isVerified && <FaCircleCheck color="#17A1FA" />}
					</span>
					<span>@{username}</span>
					<span className="text-gray-500">
            {formatDate(date)}
					</span>
				</div>

				{/* Post content goes here */}
				<div>{text}</div>

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