import { FaCircleCheck } from "react-icons/fa6";
import Actions from "./Actions";

const Post = ({ isVerified, upvotes, downvotes, shares, comments, text, name, username, avatar }) => {
	const date = new Date();
	const day = date.getDay();
	const month = date.toLocaleString("default", { month: "short" });

	return (
		<div className="border-b-2 border-gray-300 p-4 flex flex-row gap-2 h-fit min-w-[400px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px]">
			<div>
				<img src={avatar} alt="avatar" />
			</div>

			<div className="flex flex-col gap-2 w-full">
				<div className="flex flex-row gap-2 lg:gap-5">
					<span className="font-semibold flex flex-row items-center gap-2">
						{name}
            {isVerified && <FaCircleCheck color="#17A1FA" />}
					</span>
					<span>@{username}</span>
					<span className="text-gray-500">
						{month} {day}
					</span>
				</div>

				{/* Post content goes here */}
				<div>
					{text?.map((text, index) => {
						return <div key={index}>{text}</div>;
					})}
				</div>

				{/* Post actions */}

				<Actions
					upvotes={upvotes}
					downvotes={downvotes}
					comments={comments}
					shares={shares}/>
			</div>
		</div>
	);
};

export default Post;
