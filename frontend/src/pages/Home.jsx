import InfiniteScroll from "react-infinite-scroll-component";
import { BsPlusLg } from "react-icons/bs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
	Sidebar,
	Post,
	AnnouncementContainer,
	HeaderComponent,
	BottomNav,
	Loader,
	AddPostForm,
} from "../components";
import { getPosts } from "../utils";

const Home = () => {
	// States for managing posts and pagination
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Function to load more posts
  const loadMore = async () => {
    try {
      const response = await getPosts(page + 1, 10); // Use the getPosts function with the next page
      if (response.noMorePosts) {
        setHasMore(false);
      } else if (response.posts) {
        setPosts([...posts, ...response.posts]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching more posts", error);
      setHasMore(false);
    }
  };

  // Use useEffect to fetch initial posts
  useEffect(() => {
    // Function to fetch initial posts
    const fetchInitialPosts = async () => {
      try {
        const response = await getPosts(page, 10); // Use the getPosts function with the initial page
        if (response.posts) {
          setPosts(response.posts);
        }
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };

    // Fetch initial posts only when the component mounts
    if (page === 1) {
      fetchInitialPosts();
    }
  }, [page]);

  // State for managing modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleModalOpen = () => {
		console.log("Handle modal open");
		setIsModalOpen(!isModalOpen);
	};

	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			className="flex "
		>
			<Sidebar />
			<div className="flex flex-col relative w-full">
				<HeaderComponent title="Home" url={"Placeholder"} />
				<InfiniteScroll
          dataLength={posts.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<Loader />}
          endMessage={<p className="text-center text-gray-500 p-20">No more posts to show</p>}
        >
          {posts.map((post) => (
            <Post
              key={post._id}
              upvotes={post.upvotes.length}
              downvotes={post.downvotes.length}
              comments={post.comments.length}
              isVerified={post.user.isVerified}
              text={post.text}
              image={post.image}
              name={post.user.name}
              username={post.user.username}
              avatar={post.user.profilePicture}
              createdAt={post.createdAt}
              u_id={post.user._id}
              postId={post._id}
            />
          ))}
        </InfiniteScroll>
				{/* Add post button */}

				<div
					onClick={handleModalOpen}
					className="fixed bottom-20 sm:bottom-16 text-3xl right-[7vw] md:right-[10vw] lg:right-[30vw] p-5 rounded-full text-white bg-primary cursor-pointer"
				>
					<BsPlusLg />
				</div>

				{/* Add post modal */}

				<div>
					{isModalOpen && (
						<AddPostForm handleModalOpen={handleModalOpen} />
					)}
				</div>
			</div>
			<AnnouncementContainer />
			<BottomNav />
		</motion.div>
	);
};

export default Home;
