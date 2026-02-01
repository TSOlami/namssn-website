import {
	BiComment,
	BiShareAlt,
	BiSolidDownvote,
	BiSolidUpvote,
} from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Actions = ({
	upvotes,
	downvotes,
	isUpvoted,
	isDownvoted,
	onUpvote,
	onDownvote,
	comments,
	postId,
	blogId,
	onToggleComments,
	isCommentsExpanded = false,
}) => {
	const navigate = useNavigate();
	const handleCommentClick = () => {
		if (onToggleComments) {
			onToggleComments();
		} else {
			navigate('/home');
		}
	};
	const handleShare = async () => {
    if (postId) {
			try {
				await navigator.share({
					title: "Share post",
					text: 'Check out this post!',
					url: `${window.location.origin}/home`
				});
			} catch (error) {
				console.error('Error sharing:', error);
			}
		} else {
			try {
				await navigator.share({
					title: "Share post",
					text: 'Check out this post!',
					url: `/blog#${blogId}`
				});
			} catch (error) {
				console.error('Error sharing:', error);
			}
		}
    };
	upvotes = upvotes?.length;
	downvotes = downvotes?.length;
	comments = comments?.length;

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
						<span>{upvotes} {" "} </span>
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
						<span>{downvotes}{" "} </span>
					</button>
				</span>
				<span>Downvotes</span>
			</div>

			{location.pathname !== "/blog" && (
				<div>
					<span className="flex flex-row items-center gap-1">
						<button
							className={`flex flex-row items-center gap-1 ${isCommentsExpanded ? "text-primary" : ""}`}
							onClick={handleCommentClick}
						>
							<BiComment />
							<span>{comments}{" "} </span>
						</button>
					</span>
					<span>Comments</span>
				</div>
			)}

			<div onClick={handleShare}>
				<span className="flex items-center gap-1 cursor-pointer">
					<BiShareAlt />
				</span>
				<span>Share</span>
			</div>

		</div>
	);
};

export default Actions;
