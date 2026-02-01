import {
	BiShareAlt,
	BiSolidDownvote,
	BiSolidUpvote,
} from "react-icons/bi";

const CommentActions = ({
	upvotes,
	downvotes,
	onUpvote,
	onDownvote,
	isUpvoted,
	isDownvoted,
	postId
}) => {
	upvotes = upvotes?.length;
	downvotes = downvotes?.length;

	const handleShare = async () => {
        try {
            await navigator.share({
                title: "Share comment",
                text: 'Check out this comment!',
                url: `${window.location.origin}/home`
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

	return (
		<div className="py-4 flex flex-row justify-between gap-5 pr-4 items-center">
			<div>
				<span className="flex flex-row items-center gap-1">
					<button
						onClick={onUpvote}
						className="flex flex-row items-center gap-1"
					>
						{isUpvoted ? (
							<BiSolidUpvote color="#17A1FA" />
						) : (
							<BiSolidUpvote />
						)}
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
						{isDownvoted ? (
							<BiSolidDownvote color="red" />
						) : (
							<BiSolidDownvote />
						)}
						{downvotes}{" "}
					</button>
				</span>
				<span>Downvotes</span>
			</div>

			<div onClick={handleShare}>
				<span className="flex items-center gap-1">
					<BiShareAlt />
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
