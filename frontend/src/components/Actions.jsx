import { BiDownvote, BiShareAlt, BiSolidDownvote, BiSolidUpvote, BiUpvote } from "react-icons/bi"
import { FaRegComment } from "react-icons/fa6"

const Actions = ({upvotes, downvotes, comments, shares}) => {
  return (
    <div className="py-4 flex flex-row justify-between pr-5 items-center">
    <div>
      <span className="flex items-center gap-1">
        {upvotes ? (
          <>
            <BiSolidUpvote color="#17A1FA" /> {upvotes}
          </>
        ) : (
          <>
            <BiUpvote /> {0}{" "}
          </>
        )}
      </span>
      <span>Upvotes</span>
    </div>
    <div>
      <span className="flex items-center gap-1">
        {downvotes ? (
          <>
            {" "}
            <BiSolidDownvote color="red" /> {downvotes}{" "}
          </>
        ) : (
          <>
            {" "}
            <BiDownvote /> {0}{" "}
          </>
        )}
      </span>
      <span>Downvotes</span>
    </div>
    <div>
      <span className="flex items-center gap-1">
        <FaRegComment /> {comments}
      </span>
      <span>Comments</span>
    </div>
    <div>
      <span className="flex items-center gap-1">
        <BiShareAlt /> {shares}
      </span>
      <span>Shares</span>
    </div>
  </div>
  )
}

export default Actions