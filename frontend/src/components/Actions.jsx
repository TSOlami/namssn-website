import {
	BiComment,
	BiDownvote,
	BiShareAlt,
	BiSolidDownvote,
	BiSolidUpvote,
	BiUpvote,
} from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Actions = ({
	upvotes,
	downvotes,
	comments,
	shares,
	isUpvoted,
	onUpvote,
	isDownvoted,
	onDownvote,
	postId,
}) => {
	const navigate = useNavigate();
	const routeToComments = () => {
		navigate(`/comments/${postId}`);
	};

	// const [openComment, setOpencomment] = useState(false);
	// const handleOpenComment = () => {
	// 	setOpencomment(!openComment);
	// };
	// const location = useLocation();
	return (
		<div className="py-4 flex flex-row justify-start gap-20 pr-4 items-center">
			<div>
				<span className="flex flex-row items-center gap-1">
					{isUpvoted ? (
						<button
							onClick={onUpvote}
							className="flex flex-row items-center gap-1"
						>
							<BiSolidUpvote color="#17A1FA" />
							<span>{upvotes} </span>
						</button>
					) : (
						<button
							onClick={onUpvote}
							className="flex flex-row items-center gap-1"
						>
							<BiUpvote /> {upvotes}{" "}
						</button>
					)}
				</span>
				<span>Upvotes</span>
			</div>
			<div>
				<span className="flex flex-row items-center gap-1">
					{isDownvoted ? (
						<button
							onClick={onDownvote}
							className="flex flex-row items-center gap-1"
						>
							<BiSolidDownvote color="red" /> {downvotes}{" "}
						</button>
					) : (
						<button
							onClick={onDownvote}
							className="flex flex-row items-center gap-1"
						>
							<BiDownvote /> {downvotes}{" "}
						</button>
					)}
				</span>
				<span>Downvotes</span>
			</div>

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

export default Actions;
