import { BsPlusLg } from "react-icons/bs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import {
	Sidebar,
	Post,
	AnnouncementContainer,
	HeaderComponent,
	BottomNav,
	Loader,
	AddPostForm,
} from "../components";
import { useAllPostsQuery, setPosts, setCurrentPage } from "../redux";

const Home = () => {
  // Use the useSelector hook to access redux store state
  const page = useSelector((state) => state.auth.currentPage);
  const postsFromStore = useSelector((state) => state.auth.posts);

  console.log("Posts from store: ", postsFromStore);
 
  // Use the useDispatch hook to dispatch actions
  const dispatch = useDispatch();

  // Use the useAllPostsQuery hook to get all posts
  const { data: posts, isLoading } = useAllPostsQuery(Number(page));
  // console.log("Data from api call: ", posts);

  // Function to fetch more posts
  const fetchMorePosts = () => {
    if (Number(page) < Number(totalPages)) {
      dispatch(setCurrentPage(page + 1));
    }
  };

  // State for managing modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleModalOpen = () => {
		console.log("Handle modal open");
		setIsModalOpen(!isModalOpen);
	};


  // Dispatch the setPosts action to set the posts in the local state
  useEffect(() => {
    if (posts) {
      console.log("Posts from api call: ", posts);
      dispatch(setPosts(posts.posts)); // Update Redux store if needed
    }
  }, [posts, dispatch]);

  // Get the total number of pages from the API response
  const totalPages = posts?.totalPages;

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        fetchMorePosts();
      }
    });

    return () => {
      window.removeEventListener("scroll", () => {
        if (
          window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight
        ) {
          fetchMorePosts();
        }
      });
    };
  }, [page, totalPages]);

 
	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			className="flex "
		>
			<Sidebar />
			<div className="flex flex-col relative w-full">
      {isLoading === false && <div className="sticky top-[0.01%] z-[300] bg-white w-[100%]">
				  <HeaderComponent title="Home" url={"Placeholder"} />
			</div>}

        {/* Posts container */}
        {postsFromStore?.map((post, index) => (
          <Post
            key={index}
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

        {/* Loader */}
        {isLoading && <Loader />}

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