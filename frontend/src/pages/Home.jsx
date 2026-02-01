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
  AddPostForm,
  InfiniteScrollSentinel,
} from "../components";
import { PostListSkeleton } from "../components/skeletons";
import { useGetFeedQuery, setCurrentPage, setUnreadNotificationsCount, logout, useLogoutMutation } from "../redux";
import { apiSlice } from "../redux/slices/apiSlice";

const Home = () => {
  const page = useSelector((state) => state.auth.currentPage);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logutUser] = useLogoutMutation();
  const [postData, setPostData] = useState([]);
  const { data: feed, isLoading: isLoadingPosts, error } = useGetFeedQuery({ page: Number(page), sort: 'recommended' });
  const posts = feed ? { page: feed.page, totalPages: feed.totalPages, posts: feed.posts } : null;

  useEffect(() => {
    if (error?.status === 401) {
      logutUser();
      dispatch(logout());
      toast.error("Sorry, You might need to login again.");
      navigate("/signin");
    }
  }, [error, dispatch, logutUser, navigate]);

  useEffect(() => {
    if (feed?.unreadNotificationsCount !== undefined) {
      dispatch(setUnreadNotificationsCount(feed.unreadNotificationsCount));
    }
  }, [feed?.unreadNotificationsCount, dispatch]);

  const [hasMore, setHasMore] = useState(true);
  const [isgettingMorePosts, setIsGettingMorePosts] = useState(false);

  // Reset to page 1 when entering Home so feed always starts from the top
  useEffect(() => {
    dispatch(setCurrentPage(1));
    setHasMore(true);
  }, [dispatch]);

  useEffect(() => {
    if (!posts) return;
    const currentPage = posts.page;
    if (currentPage === 1) {
      setPostData(posts.posts ?? []);
    } else {
      setPostData((prevData) => {
        const postIds = new Set(prevData.map((post) => post._id));
        const newPosts = (posts.posts ?? []).filter((post) => !postIds.has(post._id));
        return [...prevData, ...newPosts];
      });
    }
    setIsGettingMorePosts(false);
  }, [posts]);

  const totalPages = posts?.totalPages;

  // Prefetch next page when current feed is loaded to speed up infinite scroll
  useEffect(() => {
    if (!feed || !totalPages || page >= totalPages) return;
    dispatch(apiSlice.util.prefetch('getFeed', { page: page + 1, sort: 'recommended' }, {}));
  }, [feed, page, totalPages, dispatch]);

  const appendNewPost = (newPostData) => {
    setPostData((prevData) => [newPostData, ...prevData]);
  };

  const updatePostData = (postId, newPostData) => {
    setPostData((prevData) => {
      const postIndex = prevData.findIndex((post) => post._id === postId);
      if (postIndex === -1) {
        return [...prevData, newPostData];
      } else {
        return prevData.map((post, index) =>
          index === postIndex ? newPostData : post
        );
      }
    });
  };

  const removePost = (postId) => {
    setPostData((prevData) => prevData.filter((post) => post._id !== postId));
  };

  const getNextPosts = async (pageCurrent) => {
    setIsGettingMorePosts(true);
    try {
      if (Number(pageCurrent) < Number(totalPages)) {
        dispatch(setCurrentPage(pageCurrent + 1));
      } else {
        setHasMore(false);
        setIsGettingMorePosts(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
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
        <div className="sticky top-[0.01%] z-[300] bg-white w-[100%]">
          <HeaderComponent title="Home" url={"Placeholder"} />
        </div>

        {isLoadingPosts && <PostListSkeleton count={4} />}

        {!isLoadingPosts && postData?.map((post, index) => (
          <Post
            key={post._id ?? index}
            post={post}
            updatePostData={(postId, newPostData) =>
              updatePostData(postId, newPostData)
            }
            removePost={(postId) => removePost(postId)}
          />
        ))}

        {isgettingMorePosts && <PostListSkeleton count={2} />}

        <InfiniteScrollSentinel
          onLoadMore={() => getNextPosts(page)}
          hasNextPage={hasMore}
          isLoadingMore={isgettingMorePosts}
          className="h-6 w-full pb-12 md:pb-0"
        />

        <div
          onClick={handleModalOpen}
          className="fixed bottom-20 sm:bottom-16 right-4 md:right-[10vw] lg:right-[30vw] w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full text-white bg-primary cursor-pointer shadow-lg hover:opacity-90 text-xl sm:text-2xl"
          aria-label="Add post"
        >
          <BsPlusLg />
        </div>

        {isModalOpen && (
          <AddPostForm handleModalOpen={handleModalOpen} appendNewPost={appendNewPost} />
        )}
      </div>
      <AnnouncementContainer />
      <BottomNav />
    </motion.div>
  );
};

export default Home;