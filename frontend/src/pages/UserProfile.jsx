import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCircleCheck } from "react-icons/fa6";

import { useGetUserQuery, useUserPostsQuery } from '../redux';
import { Post, Sidebar, AnnouncementContainer } from '../components';
import { ErrorPage } from '../pages';
import { ProfileImg } from "../assets";
import { ProfileSkeleton, PostListSkeleton } from '../components/skeletons';

const UserProfile = () => {
  const { userId } = useParams();
  const { data: user, isLoading: userLoading } = useGetUserQuery({ _id: userId });
  const name = user?.name;
  const { data: userPosts, isLoading: postsLoading } = useUserPostsQuery({ _id: userId });
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    if (userPosts) {
      setPostData(userPosts);
    }
  }, [userPosts]);

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

  if (!userLoading && !user) {
    return <ErrorPage/>;
  }

  const username = user?.username;
  const bio = user?.bio;
  const isVerified = user?.isVerified;
  const points = user?.points;
  const noOfPosts = userPosts?.length;
  const avatar = user?.profilePicture;
  const coverPhoto = user?.coverPhoto;

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
                {coverPhoto ? (
					<div className="w-full h-32 z-[-1] overflow-hidden">
						<img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
					</div>
				) : (
					<div className="w-full h-32 bg-primary z-[-1]"></div>
				)}
                <div className="flex flex-row justify-between items-center relative top-[-25px] my-[-30px] p-3 pl-6 z-[0] flex-wrap gap-2">
                    <img src={avatar || ProfileImg} alt="" className="profile-image"/>
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
