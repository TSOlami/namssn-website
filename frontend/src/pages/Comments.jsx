import { useParams } from "react-router-dom";
import { AnnouncementContainer, HeaderComponent, Post, PostComments, Sidebar } from "../components"
// import { usePostCommentsQuery } from "../redux/slices/postSlice";
import { mockComments } from "../data";

const Comments = () => {

  const { postId } = useParams();

  // Loading indicator while data is being fetched
  // if (isLoading) {
  //   return <Loader />;
  // }

  // const { data: post } = usePostCommentsQuery(postId);
  return (
    <div className="flex flex-row">
      <Sidebar />

      <div>
        <HeaderComponent title="Comments" />
        <div>
          
          <Post
            title="Post title"
            description="Post description"
            upvotes={10}
            downvotes={5}
            comments={2}
            isUpvoted={false}
            isDownvoted={false}
            postId={postId}
            username="Mr_designer"
            name="Ifedimeji Omoniyi"
            text="This is a random text meant to hardcode the comments part of this application"
            />
            
        </div>
        
        {/* Add comment */}
        <div>
          <textarea name="comment"
          placeholder="Add comment"
         id="" className="resize-none border-2 border-gray-400 w-full p-2 rounded-xl mb-2 m-4 mr-14 "></textarea>

         <button className="p-2 bg-primary rounded-xl text-white flex ml-auto hover:opacity-80">Add Comment</button>
        </div>

        <div>
          {/* {post?.comments?.map((comment, index) => {
            return (
              <PostComments
                key={index}
                postId={postId}
                commentId={comment?._id}
                text={comment?.text}
                name={comment?.user?.name}
                username={comment?.user?.username}
                avatar={comment?.user?.avatar}
                createdAt={comment?.createdAt}
                updatedAt={comment?.updatedAt}
                u_id={comment?.user?._id}
              />
            );

          }
          )} */}

          {mockComments.map((item, index) => 
          <PostComments 
          key={index}
          text={item.text}
          username={item.username}
          name={item.name}
          createdAt={"Oct 14, 2023, 07:50 AM"}
          />
          )}
      </div>
      </div>

      <AnnouncementContainer/>
    </div>
  )
}

export default Comments