import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { IoSend } from "react-icons/io5";

import {
	AnnouncementContainer,
	HeaderComponent,
	Post,
	Sidebar,
} from "../components";
import { useCommentPostMutation, usePostCommentsQuery } from "../redux";
import { Loader, PostComments } from "../components";

const Comments = () => {
	const { postId } = useParams();
  console.log("Post ID: ", postId);
  console.log("Fetching comments for post with id: ", postId);

  const { data: comments, isLoading } = usePostCommentsQuery({ postId: postId });
  console.log("Comments: ", comments);
  const [commentPost] = useCommentPostMutation();

	// Use useSelector to select the 'auth' slice of the state
  const auth = useSelector((state) => state.auth);

	// Find the post with a matching _id within the 'auth.posts' array
  const post = auth.posts.find((p) => p._id === postId);

  // Use the usePostCommentsQuery hook to fetch comments for the post
  const [commentText, setCommentText] = useState("");

	// Check if the post was found
  if (!post) {
    return <p className="text-center mt-28">This post has been deleted</p>;
  }
  
	console.log("Comments :",comments);
	// Loading indicator while data is being fetched
	if (isLoading) {
    return <Loader />;
	}

	// const { data: post } = usePostCommentsQuery(postId);
  // Handle comment submission
  const handleCommentSubmit = async () => {
    try {
      const response = await commentPost({ postId: postId,
      data: {
        text: commentText,
      }, });
      console.log(response);
      setCommentText("");
    } catch (error) {
      console.error("Comment submission failed", error);
      console.log(error.message);
    }
  };
	return (
		<div className="flex flex-row w-full">
			<Sidebar />

			<div className="flex flex-col flex-1 relative">
				<HeaderComponent title="Post" />
				<div className="w-full">
					<Post
						key={post?._id}
            upvotes={post?.upvotes?.length}
            downvotes={post?.downvotes?.length}
            comments={post?.comments?.length}
            isVerified={post?.user?.isVerified}
            text={post?.text}
            name={post?.user?.name}
            username={post?.user?.username}
            createdAt={post?.createdAt}
            u_id={post?.user?._id}
            postId={post?._id}
					/>
				</div>

				{/* Add comment */}
				<div className="flex flex-row fixed bottom-3 lg:left-[250px] xl:w-[700px] lg:w-[500px] md:left-[2px] md:w-[450px] w-screen left-0 wide:w-[850px]">
					<textarea
						name="comment"
						placeholder="Add comment"
						id=""
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
						className="resize-none border-2 border-gray-40 h-[47px] w-full p-2 rounded-xl mr-1 m-2 "
					></textarea>

					<div 
          onClick={() => {
            // Handle comment submission here
            handleCommentSubmit();
          }}
          className="p-2 m-2 bg-primary rounded-xl text-white flex items-center text-2xl hover:opacity-80">
						<IoSend/>
					</div>
				</div>
        {/* <div>
				{comments && comments?.length === 0 ? ( // Check if post comments is defined and has no comments
					<div className="text-center mt-4 p-4 text-gray-500">
					No comments to display.
					</div>
				) : comments?.map((comment) => ( // Use post._id as the key
					<PostComments
          key={comment._id}
          postId={postId}
          commentId={comment._id}
					upvotes={post.upvotes.length}
					downvotes={post.downvotes.length}
          isVerified={comment.user.isVerified}
          text={comment.text}
          name={comment.user.name}
          username={comment.user.username}
					createdAt={comment.createdAt}
					u_id={comment.user._id}
					/>
				))}
				</div> */}
			</div>

			<AnnouncementContainer />
		</div>
	);
};

export default Comments;
