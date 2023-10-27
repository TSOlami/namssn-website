import InfiniteScroll from 'react-infinite-scroll-component';
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
// import { getPosts } from "../utils";
import { useAllPostsQuery, setPosts, setCurrentPage } from "../redux";
// import { toast } from "react-toastify";

const Home = () => {
  // Use the useSelector hook to access redux store state
  const page = useSelector((state) => state.auth.currentPage);

	// States for managing posts and pagination
  // const [postData, setPostData] = useState([]);
  // const [page, setPage] = useState(1);

  // State for managing posts and pagination
  const [postList, setPostList] = useState([]); // Initialize an empty list

  const [hasMore, setHasMore] = useState(true);
  // const [isLoadingMore, setIsLoadingMore] = useState(false);
  // console.log("Page: ", page);

  // Use the useDispatch hook to dispatch actions
  const dispatch = useDispatch();

  // const [ allposts, { isLoading } ] = useAllPostsQuery();

  // Use the useAllPostsQuery hook to get all posts
  const { data: posts, isLoading } = useAllPostsQuery(Number(page));
  // console.log("Data from api call: ", posts);

  // Dispatch the setPosts action to set the posts in the redux store
  // Dispatch the setPosts action to set the posts in the local state
  useEffect(() => {
    if (posts) {
      console.log("Posts from api call: ", posts);
      setPostList((prevPosts) => [...prevPosts, ...posts.posts]); // Append new posts to existing ones
      dispatch(setPosts(posts.posts)); // Update Redux store if needed
    }
  }, [posts, dispatch]);

  console.log("Post list: ", postList);

  // Get the total number of pages from the API response
  const totalPages = posts?.totalPages;

  // Use the custom hook to fetch more posts
  // const nextPage = page + 1;

  // Function to fetch more posts
  const fetchMorePosts = () => {
    if (Number(page) < Number(totalPages)) {
      dispatch(setCurrentPage(page + 1));
    } else {
      setHasMore(false); // No more pages to load
    }
  };

  // // Function to fetch more posts
  // const getNextPosts = async (pageCurrent) => {
  //   if (Number(pageCurrent) < Number(totalPages)) {
  //     dispatch(setCurrentPage(pageCurrent + 1));
  //   }
  // }

  // // Function to fetch previous posts
  // const getPreviousPosts = async (pageCurrent) => {
  //   if (Number(pageCurrent) === 1) {
  //     toast.error("You are currently seeing the latest posts");
  //   } else {
  //     dispatch(setCurrentPage(pageCurrent - 1));
  //   }
  // }
  
  // Function to load more posts manually
  // const loadMorePosts = async () => {
  //   if (!isLoadingMore) {
  //     setIsLoadingMore(true);
  //     try {
  //       if (nextPage <= totalPages) {  // Check if there are more pages to load
  //         const {data: posts} = await getNextPosts(); // Use the custom hook to fetch more posts
  //         console.log("Response from api call: ", posts);
  //         if (posts.posts && Array.isArray(posts.posts)) {
  //           dispatch(setPosts([...posts, ...posts.posts])); // Append new posts to the existing ones
  //           setPage(nextPage);
  //         }
  //       } else {
  //         // You've reached the last page, handle this scenario (e.g., display a message)
  //       }
  //     } catch (error) {
  //       console.error("Error fetching more posts", error);
  //     } finally {
  //       setIsLoadingMore(false);
  //     }
  //   }
  // };  

  // const posts = data?.posts;

  // Use the useEffect hook to set the posts in the state
  // useEffect(() => {
  //   if (data) {
  //     dispatch(setPosts(data));
  //   }
  // }, [data, dispatch]);

  // Function to load more posts
  // const loadMore = async () => {
  //   try {
  //     const response = await allposts(page + 1, 10); // Use the getPosts function with the next page
  //     if (response.pageSize === 0){
  //       setHasMore(false);
  //     } else if (response.posts) {
  //       dispatch(setPosts(data.concat(response.posts)));
  //       setPage(page + 1);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching more posts", error);
  //     setHasMore(false);
  //   }
  // }

  // Function to load more posts
  // const loadMore = async () => {
  //   try {
  //     const response = await getPosts(page + 1, 10); // Use the getPosts function with the next page
  //     if (response.noMorePosts) {
  //       setHasMore(false);
  //     } else if (response.posts) {
  //       dispatch(setPosts([...postData, ...response.posts]));
  //       setPostData([...postData, ...response.posts]);
  //       setPage(page + 1);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching more posts", error);
  //     setHasMore(false);
  //   }
  // };

  // Use useEffect to fetch initial posts
  // useEffect(() => {
  //   // Function to fetch initial posts
  //   const fetchInitialPosts = async () => {
  //     try {
  //       const response = await getPosts(page, 10); // Use the getPosts function with the initial page
  //       if (response.posts) {
  //         dispatch(setPosts(response.posts));
  //         setPostData(response.posts);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching posts", error);
  //     }
  //   };

    // Fetch initial posts only when the component mounts
  //   if (page === 1) {
  //     fetchInitialPosts();
  //   }
  // }, [page, dispatch]);

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
        <InfiniteScroll
          dataLength={posts?.posts?.length || 0}
          next={fetchMorePosts}
          hasMore={hasMore}
          loader={<Loader />} // Display a loader while loading more posts
        >
          {postList?.map((post, index) => (
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
          </InfiniteScroll>
        {/* Loader */}
        {isLoading && <Loader />}
        {/* Paginate posts buttons */}
        {/* <button onClick={() => getPreviousPosts(page)} className="text-primary">
          Previous
        </button>
        <button onClick={() => getNextPosts(page)} className="text-primary">
          Next
        </button> */}


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
