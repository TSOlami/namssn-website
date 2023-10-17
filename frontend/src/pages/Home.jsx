import { BsPlusLg } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';

import { Sidebar, Post, AnnouncementContainer, HeaderComponent, BottomNav, Loader, AddPostForm } from "../components";
import { useAllPostsQuery, setPosts } from "../redux";

const Home = () => {
  // Fetch all posts
  const { data: posts, isLoading } = useAllPostsQuery();

  const dispatch = useDispatch();

  // Use useEffect to set posts after component mounts
  useEffect(() => {
    if (posts) {
      dispatch(setPosts(posts));
    }
  }, [dispatch, posts]);

	const [isModalOpen, setIsModalOpen] = useState(false)
	const handleModalOpen = () => {
    console.log("Handle modal open");
		setIsModalOpen(!isModalOpen)
	}

	return (
		<div className="flex ">
			<Sidebar/>
			<div className="flex flex-col relative w-full">
				<HeaderComponent title="Home" url={"Placeholder"}/>
				{isLoading ? (
          <Loader />
        ) : (
          <>
            {posts?.map((post) => {
              console.log("Post: ", post);
              return (
                <Post
									key={post?._id}
									upvotes={post?.upvotes?.length}
									downvotes={post?.downvotes?.length}
									comments={post?.comments?.length}
									isVerified={post?.user?.isVerified}
									text={post?.text}
									name={post?.user?.name}
									username={post?.user?.username}
									avatar={post?.user?.profilePicture}
									createdAt={post?.createdAt}
									u_id={post?.user?._id}
									postId={post?._id}
								/>
              );
            })}
          </>
        )}
				{/* Add post button */}

				<div onClick={handleModalOpen} className="fixed bottom-20 sm:bottom-16 text-3xl right-[7vw] md:right-[10vw] lg:right-[30vw] p-5 rounded-full text-white bg-primary cursor-pointer">
					<BsPlusLg/>
				</div>


				{/* Add post modal */}

				<div>
					{isModalOpen && (
						<AddPostForm handleModalOpen={handleModalOpen}/>
					)}
				</div>
			</div>
			<AnnouncementContainer/>
			<BottomNav/>
		</div>
	);
};

export default Home;
