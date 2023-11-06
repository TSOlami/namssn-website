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
	postId,
	blogId
}) => {
	const navigate = useNavigate();
	const routeToComments = () => {
		navigate(`/comments/${postId}`);
	};

	const handleShare = async () => {
        if (postId) {
			try {
				await navigator.share({
					title: "Share post",
					text: 'Check out this post!',
					url: `/comments/${postId}`
				});
				console.log('Link shared successfully');
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
				console.log('Link shared successfully');
			} catch (error) {
				console.error('Error sharing:', error);
			}
		}
    };
	// const [openComment, setOpencomment] = useState(false);
	// const handleOpenComment = () => {
	// 	setOpencomment(!openComment);
	// };
	// const location = useLocation();
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
						<span>{upvotes?.lenght} {" "} </span>
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
						<span>{downvotes?.lenght}{" "} </span>
					</button>
				</span>
				<span>Downvotes</span>
			</div>

			{location.pathname !== "/blog" && (
				<div>
					<span className="flex flex-row items-center gap-1">
						<button
							className="flex flex-row items-center gap-1"
							onClick={routeToComments}
						>
							<BiComment />
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

export default Actions;
