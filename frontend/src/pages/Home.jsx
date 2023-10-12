import { BsPlusLg } from "react-icons/bs";
import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';

import { Sidebar, Post, AnnouncementContainer, HeaderComponent, BottomNav, Loader, AddPostForm } from "../components";
import { Wrapper } from '../assets';
import { useAllPostsQuery } from "../redux";

const Home = () => {
  // const { userInfo } = useSelector((state) => state.userLogin);

  // Check if user is Verified
  // const isVerified = userInfo?.isVerified;

	// Fetch all posts
  const { data: posts, isLoading } = useAllPostsQuery();

	const [isModalOpen, setIsModalOpen] = useState(false)
	const handleModalOpen = () => {
		setIsModalOpen(!isModalOpen)
	}

	return (
		<div className="flex ">
			<Sidebar/>
			<div className="flex flex-col relative">
				<HeaderComponent title="Home"/>
				{isLoading ? (
          <Loader />
        ) : (
          <>
            {posts.map((post, index) => {
              console.log(`Post ${index + 1}:`, post);
              return (
                <Post
									key={post?._id || []}
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
						<AddPostForm/>
					)}
				</div>
			</div>
			<AnnouncementContainer/>
			<BottomNav/>
		</div>
	);
};

export default Home;
