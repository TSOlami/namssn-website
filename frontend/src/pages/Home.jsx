import { BsPlusLg } from "react-icons/bs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  Sidebar,
  Post,
  AnnouncementContainer,
  HeaderComponent,
  BottomNav,
  Loader,
  AddPostForm,
} from "../components";
import { useAllPostsQuery, setCurrentPage, useGetNotificationsQuery, setNotifications, logout, useLogoutMutation } from "../redux";

const Home = () => {
  // Use the useSelector hook to access redux store state
  const page = useSelector((state) => state.auth.currentPage);

  // Use the useDispatch hook to dispatch actions
  const dispatch = useDispatch();

  // Use the navigate hook from the react-router-dom to navigate to a different route
  const navigate = useNavigate();

  // Use the useLogoutMutation hook to logout a user
  const [logutUser] = useLogoutMutation();

  // State for managing posts
  const [postData, setPostData] = useState([]);

  // Use the useAllPostsQuery hook to get all posts
  const { data: posts, isLoading: isLoadingPosts } = useAllPostsQuery(Number(page));

  // Use the useGetNotificationsQuery hook to get notifications from the API
  const { data: notifications, error  } = useGetNotificationsQuery();

  // Add a useEffect hook to check if a user is properly authenticated
  useEffect(() => {
    if (error?.status === 401) {
      // If the user is not authenticated, logout the user
      logutUser();
      // Dispatch the logout action
      dispatch(logout());
      toast.error("Sorry, You might need to login again.");
      navigate("/signin");
    }
  }, [error, dispatch, logutUser]);

  // Set the notifications in the redux store
  useEffect(() => {
    if (notifications) {
      dispatch(setNotifications(notifications));
    }
  }, [notifications, dispatch]);

  // State to manage HasMore
  const [hasMore, setHasMore] = useState(true);

  // State to manage getting more posts
  const [isgettingMorePosts, setIsGettingMorePosts] = useState(false);

  // Dispatch the setPosts action to set the posts in the redux store
  useEffect(() => {
    if (posts) {
      // Identify unique post IDs
      const postIds = new Set(postData.map(post => post._id));

      // Filter out posts that already exist in the postData array
      const newPosts = posts.posts.filter(post => !postIds.has(post._id));
      
      // Append the new posts to the postData array
      setPostData((prevData) => [...prevData, ...newPosts]);
      setIsGettingMorePosts(false);
    }
  }, [posts]);

  // Get the total number of pages from the API response
  const totalPages = posts?.totalPages;

  // Function to append new post to the post data
  const appendNewPost = (newPostData) => {
    // Append the new post data to your local state
    setPostData((prevData) => [newPostData, ...prevData]);
  };

  // Function to update the post data when a vote is cast
  const updatePostData = (postId, newPostData) => {
    setPostData((prevData) => {
      const postIndex = prevData.findIndex((post) => post._id === postId);
  
      if (postIndex === -1) {
        // If the post doesn't exist in the array, add it
        return [...prevData, newPostData];
      } else {
        // If the post already exists, update it
        return prevData.map((post, index) =>
          index === postIndex ? newPostData : post
        );
      }
    });
  };

  // Function to remove a post from the post data
  const removePost = (postId) => {
    setPostData((prevData) => prevData.filter((post) => post._id !== postId));
  };

  // Function to fetch more posts
  const getNextPosts = async (pageCurrent) => {
    setIsGettingMorePosts(true);
    try {
      if (Number(pageCurrent) < Number(totalPages)) {
        dispatch(setCurrentPage(pageCurrent + 1));
      } else {
        // If the current page is the last page, set hasMore to false
        setHasMore(false);
        setIsGettingMorePosts(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // State for managing modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (isLoadingPosts) {
    return <Loader />; // Render the Loader while data is being fetched
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex "
    >
      <Sidebar />
      <div className="flex flex-col relative w-full">
      {isLoadingPosts === false && <div className="sticky top-[0.01%] z-[300] bg-white w-[100%]">
          <HeaderComponent title="Home" url={"Placeholder"} />
      </div>}

        {/* Posts container */}
        {postData?.map((post, index) => (
          <Post
            key={index}
            post={post}
            updatePostData={(postId, newPostData) =>
              updatePostData(postId, newPostData)
            }
            removePost={(postId) => removePost(postId)}
          />
        ))}

        {/* Paginate posts buttons */}
        {hasMore && (
          <div className="flex m-auto pb-12 md:pb-0">
            {isLoadingPosts || isgettingMorePosts ? (
              <button
              disabled={true}
              className="text-primary p-2 px-4 border-2 w-fit m-2 hover:rounded-md hover:bg-primary hover:text-white cursor-not-allowed"
              >
               Loading...
            </button>) : (
              <button
              onClick={() => getNextPosts(page)}
              className="text-primary p-2 px-4 border-2 w-fit m-2 hover:rounded-md hover:bg-primary hover:text-white"
            >
              Load More posts 
            </button>
              )}  
        </div>
        )}

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
            <AddPostForm handleModalOpen={handleModalOpen} appendNewPost={appendNewPost} />
          )}
        </div>
      </div>
      <AnnouncementContainer />
      <BottomNav />
    </motion.div>
  );
};

export default Home;