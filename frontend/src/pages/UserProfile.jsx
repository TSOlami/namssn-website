import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCircleCheck } from "react-icons/fa6";
import { useSelector } from 'react-redux';

import { useGetUserQuery, useUserPostsQuery, useMakeUserAdminMutation, useRemoveAdminMutation } from '../redux';
import { Post, Sidebar, AnnouncementContainer } from '../components';
import { ErrorPage } from '../pages';
import { ProfileImg } from "../assets";
import { toast } from 'react-toastify';
import { ProfileSkeleton, PostListSkeleton } from '../components/skeletons';

const UserProfile = () => {
  // Get the userId from the URL
    const { userId } = useParams();

  // Get the current user from the redux store
  const currentUser = useSelector((state) => state.auth.userInfo);

  // Fetch user profile details from the server
  const { data: user, isLoading: userLoading  } = useGetUserQuery({ _id: userId });

  // Get user name from the user object
  const name = user?.name;

  // Fetch user posts from the server
  const { data: userPosts, isLoading: postsLoading  } = useUserPostsQuery({ _id: userId });

  // Set state for managing posts
  const [postData, setPostData] = useState([]);

  // Use useEffect to set posts after component mounts
  useEffect(() => {
    if (userPosts) {
      setPostData(userPosts);
    }
  }, [userPosts]);

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

  // Make user admin
  const [makeUserAdmin] = useMakeUserAdminMutation();

  // Remove admin
  const [removeAdmin] = useRemoveAdminMutation();

  // Handle make user admin
  const handleMakeUserAdmin = async () => {
    try {
      await makeUserAdmin(userId).unwrap();
      toast.success(`${name} is now an admin`);
    } catch (err) {
			toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
    }
  };

  // Handle remove admin
  const handleRemoveAdmin = async () => {
    try {
      await removeAdmin(userId).unwrap();
      toast.success(`${name} is no longer an admin`);
    } catch (err) {
			toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
    }
  };

  // Display error message if user is not found (and not loading)
  if (!userLoading && !user) {
    return <ErrorPage/>;
  }

  // Get user profile details that was fetched from the server
  const username = user?.username;
  const bio = user?.bio;
  const isVerified = user?.isVerified;
  const isAdmin = user?.role === 'admin';
  const points = user?.points;
  const noOfPosts = userPosts?.length;
  const avatar = user?.profilePicture;

  const currentUserIsAdmin = currentUser?.role === 'admin';

  // Show skeleton while loading
  if (userLoading || postsLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className='w-full min-w-[350px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] wide:w-[850px]'>
          <ProfileSkeleton />
          <PostListSkeleton count={3} />
        </div>
        <AnnouncementContainer />
      </div>
    );
  }
  
    return (
        <div className="flex">
            <Sidebar />

            <div className='w-full min-w-[350px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] wide:w-[850px]'>
                <div className="p-3 pl-6 flex flex-col">
                    <span className="font-semibold text-lg">{name}</span>
                    <span>{noOfPosts} posts</span>
                </div>
                {/* profile image and cover image */}
                <div className="w-full h-32 bg-primary z-[-1]"></div>
                <div className="flex flex-row justify-between items-center relative top-[-25px] my-[-30px] p-3 pl-6 z-[0]">
                    <img src={avatar || ProfileImg} alt="" className="profile-image"/>
                    {currentUserIsAdmin && (
                        isAdmin ? (
                        <button onClick={handleRemoveAdmin} className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-red-500 hover:border-none ml-auto mr-2">
                            Remove Admin
                        </button>
                        ) : (
                        <button onClick={handleMakeUserAdmin} className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-green-500 hover:border-none ml-auto mr-2">
                            Make Admin
                        </button>
                        )
                    )}
                </div>
                <div className="flex flex-col text-sm p-3 pl-6">
                    <span className="font-semibold flex flex-row items-center gap-2 text-lg">
                        {name}
                        {isVerified && <FaCircleCheck color="#17A1FA" />}
                    </span>
                    <span>@{username}</span>
                    <span className="mt-2">{bio}</span>
                </div>
                <div className="font-semibold px-3 pl-6">
                    <span className="font-semibold text-xl">{points}</span> points
                </div>
                <div className="px-3 pt-3 border-b-2 pl-6 text-primary">
                    <span className="border-b-4 border-primary">Posts</span>
                </div>
                <div>
                {postData && postData?.length === 0 ? ( // Check if userPosts is defined and has no posts
                  <div className="text-center mt-28 p-4 text-gray-500">
                    No posts to display.
                  </div>
                ) : (
                  postData?.map((post, index) => (
                    <Post
                      key={index}
                      post={post}
                      updatePostData={(postId, newPostData) =>
                        updatePostData(postId, newPostData)
                      }
                      removePost={(postId) => removePost(postId)}
                    />
                  ))
                )}
              </div>
            </div>
            <AnnouncementContainer />
        </div>
    );
};

export default UserProfile;
