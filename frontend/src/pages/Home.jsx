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

	// Use the useDispatch hook to dispatch actions
	const dispatch = useDispatch();

	// State for managing posts
	const [postData, setPostData] = useState([]);

	// Use the useAllPostsQuery hook to get all posts
	const { data: posts, isLoading } = useAllPostsQuery(Number(page));

	// Dispatch the setPosts action to set the posts in the redux store
	useEffect(() => {
		if (posts) {
			console.log("Posts from api call: ", posts);
			// Merge the new data with the existing postData
			setPostData([...postData, ...posts.posts]);

			// Dispatch the updated posts to your Redux store
			dispatch(setPosts([...postData, ...posts.posts]));
		}
	}, [posts, dispatch]);

	console.log("Posts from state: ", postData);

	// Get the total number of pages from the API response
	const totalPages = posts?.totalPages;

	// Function to update the post data when a vote is cast
	const updatePostData = (postId, newPostData) => {
		// Find the post in postData by postId and update it with newPostData
		const updatedPosts = postData.map((post) =>
			post._id === postId ? newPostData : post
		);
		setPostData(updatedPosts);
	};

  // Function to fetch more posts

  const [paginationLoading, setPaginationLoading] = useState(false);
	const getNextPosts = async (pageCurrent) => {
    setPaginationLoading(true);
		try {
			if (Number(pageCurrent) < Number(totalPages)) {
				dispatch(setCurrentPage(pageCurrent + 1));
			}
		} catch (error) {
			console.log(error);
		} finally {
      setPaginationLoading(false);
		}
	};

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

				{/* Posts container */}
				{postData?.map((post, index) => (
					<Post
						key={index}
						post={post}
						updatePostData={(postId, newPostData) =>
							updatePostData(postId, newPostData)
						}
					/>
				))}

				{/* Loader */}
				{isLoading && <Loader />}

				{/* Paginate posts buttons */}
				<div className="flex m-auto">
					<button
						onClick={() => getNextPosts(page)}
						className="text-primary p-2 px-4 border-2 w-fit m-2 hover:rounded-md hover:bg-primary hover:text-white"
					>
						{paginationLoading ? 
              "Loading..." : "Load more posts"} 
					</button>
				</div>

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
