import { BiDownvote, BiShareAlt, BiSolidDownvote, BiSolidUpvote, BiUpvote } from "react-icons/bi"

const Actions = ({ upvotes, downvotes, shares, isUpvoted, onUpvote, isDownvoted, onDownvote }) => {
  console.log(upvotes, downvotes);
  return (
    <div className="py-4 flex flex-row justify-start gap-20 pr-4 items-center">
    <div>
      <span className="flex flex-row items-center gap-1">
        {isUpvoted ? (
          <button onClick={onUpvote}>
              <BiSolidUpvote color="#17A1FA" /> {upvotes}{" "}
          </button>
        ) : (
          <button onClick={onUpvote}>
            <BiUpvote /> {upvotes}{" "}
          </button>
        )}
      </span>
      <span>Upvotes</span>
    </div>
    <div>
      <span className="flex flex-row items-center gap-1">
        {isDownvoted ? (
          <button onClick={onDownvote}>
            <BiSolidDownvote color="red" /> {downvotes}{" "}
          </button>
        ) : (
          <button onClick={onDownvote}>
            <BiDownvote /> {downvotes}{" "}
          </button>
        )}
      </span>
      <span>Downvotes</span>
    </div>
    <div>
      <span className="flex items-center gap-1">
        <BiShareAlt /> {shares}
      </span>
      <span>Share</span>
    </div>
  </div>
  )
}

export default Actions