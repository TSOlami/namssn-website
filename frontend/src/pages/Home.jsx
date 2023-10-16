import { BsPlusLg } from "react-icons/bs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';

import { Sidebar, Post, AnnouncementContainer, HeaderComponent, BottomNav, Loader, AddPostForm } from "../components";
import { Wrapper } from '../assets';
import { useAllPostsQuery, setPosts } from "../redux";

const Home = () => {
  // Fetch all posts
  const { data: posts, isLoading } = useAllPostsQuery();
  const dispatch = useDispatch();

  // Set posts in redux store
  dispatch(setPosts(posts));

	const [isModalOpen, setIsModalOpen] = useState(false)
	const handleModalOpen = () => {
		setIsModalOpen(!isModalOpen)
	}

	return (
		<div className="flex ">
			<Sidebar/>
			<div className="flex flex-col relative w-full">
				<HeaderComponent title="Home"/>
				{isLoading ? (
          <Loader />
        ) : (
          <>
            {posts?.map((post, index) => {
              // console.log(`Post ${index + 1}:`, post);
              // console.log(`Post ${index + 1} user:`, post?.user);
              // console.log(`Post ${index + 1} user id`, post?.user?._id);
              return (
                <Post
									key={index}
									postId={post?._id}
									upvotes={post?.upvotes?.length}
									downvotes={post?.downvotes?.length}
									comments={post?.comments?.length}
									isVerified={post?.user?.isVerified}
									text={post?.text}
									name={post?.user?.name}
									username={post?.user?.username}
									avatar={Wrapper}
									createdAt={post?.createdAt}
									updatedAt={post?.updatedAt}
									u_id={post?.user?._id}
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
						<AddPostForm isModalOpen={isModalOpen} handleModalOpen={handleModalOpen}/>
					)}
				</div>
			</div>
			<AnnouncementContainer/>
			<BottomNav/>
		</div>
	);
};

export default Home;
