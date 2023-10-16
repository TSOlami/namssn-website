import {
	BiShareAlt,
	BiSolidDownvote,
	BiSolidUpvote,
} from "react-icons/bi";

const CommentActions = ({
	upvotes,
	downvotes,
	shares,
	onUpvote,
	onDownvote,
}) => {
	console.log("CommentActions: ", upvotes, downvotes, shares);
	return (
		<div className="py-4 flex flex-row justify-between gap-5 pr-4 items-center">
			<div>
				<span className="flex flex-row items-center gap-1">
					<button
						onClick={onUpvote}
						className="flex flex-row items-center gap-1"
					>
						<BiSolidUpvote color="#17A1FA" />
						<span>{upvotes} </span>
					</button>
				</span>
				<span>Upvotes</span>
			</div>
			<div>
				<span className="flex flex-row items-center gap-1">
					<button
						onClick={onDownvote}
						className="flex flex-row items-center gap-1"
					>
						<BiSolidDownvote color="red" /> {downvotes}{" "}
					</button>
				</span>
				<span>Downvotes</span>
			</div>

			<div>
				<span className="flex items-center gap-1">
					<BiShareAlt /> {shares}
				</span>
				<span>Share</span>
			</div>

			{/* {location.pathname !== `/comments/${postId}` && (
				<div>
					<span className="flex flex-row items-center gap-1">
						<button
							className="flex flex-row items-center gap-1"
							onClick={routeToComments}
						>
							<BiComment /> {comments}
						</button>
					</span>
					<span>Comments</span>
				</div>
			)}
			{location.pathname !== `/comments/${postId}` && (
				<div>
					<span className="flex items-center gap-1">
						<BiShareAlt /> {shares}
					</span>
					<span>Share</span>
				</div>
			)} */}
		</div>
	);
};

export default CommentActions;