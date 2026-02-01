import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCircleCheck } from "react-icons/fa6";
import { useSelector } from 'react-redux';

import { useGetUserQuery, useUserPostsQuery, useMakeUserAdminMutation, useRemoveAdminMutation, useBlockUserMutation, useUnblockUserMutation } from '../redux';
import { Post, Sidebar, AnnouncementContainer, ConfirmDialog } from '../components';
import { ErrorPage } from '../pages';
import { ProfileImg } from "../assets";
import { toast } from 'react-toastify';
import { ProfileSkeleton, PostListSkeleton } from '../components/skeletons';

const UserProfile = () => {
    const { userId } = useParams();
  const currentUser = useSelector((state) => state.auth.userInfo);
  const { data: user, isLoading: userLoading, refetch: refetchUser } = useGetUserQuery({ _id: userId });
  const name = user?.name;
  const { data: userPosts, isLoading: postsLoading  } = useUserPostsQuery({ _id: userId });
  const [postData, setPostData] = useState([]);
  const [showRemoveAdminConfirm, setShowRemoveAdminConfirm] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);

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

  const [makeUserAdmin] = useMakeUserAdminMutation();
  const [removeAdmin] = useRemoveAdminMutation();
  const [blockUserMutation] = useBlockUserMutation();
  const [unblockUserMutation] = useUnblockUserMutation();

  const handleBlockUser = async () => {
    try {
      await blockUserMutation(userId).unwrap();
      toast.success(`${name} has been blocked.`);
      refetchUser();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to block user.");
    }
    setShowBlockConfirm(false);
  };

  const handleUnblockUser = async () => {
    try {
      await unblockUserMutation(userId).unwrap();
      toast.success(`${name} has been unblocked.`);
      refetchUser();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to unblock user.");
    }
    setShowUnblockConfirm(false);
  };

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

  if (!userLoading && !user) {
    return <ErrorPage/>;
  }

  const username = user?.username;
  const bio = user?.bio;
  const isVerified = user?.isVerified;
  const isAdmin = user?.role === 'admin';
  const points = user?.points;
  const noOfPosts = userPosts?.length;
  const avatar = user?.profilePicture;

  const currentUserIsAdmin = currentUser?.role === 'admin';
  const isBlocked = user?.isBlocked;

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
                <div className="w-full h-32 bg-primary z-[-1]"></div>
                <div className="flex flex-row justify-between items-center relative top-[-25px] my-[-30px] p-3 pl-6 z-[0] flex-wrap gap-2">
                    <img src={avatar || ProfileImg} alt="" className="profile-image"/>
                    {currentUserIsAdmin && currentUser?._id !== userId && (
                      <>
                        {isAdmin ? (
                          <button onClick={() => setShowRemoveAdminConfirm(true)} className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-red-500 hover:border-none ml-auto mr-2">
                            Remove Admin
                          </button>
                        ) : (
                          <>
                            {isBlocked ? (
                              <button onClick={() => setShowUnblockConfirm(true)} className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-green-500 hover:border-none ml-auto mr-2">
                                Unblock
                              </button>
                            ) : (
                              <button onClick={() => setShowBlockConfirm(true)} className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-red-500 hover:border-none ml-auto mr-2">
                                Block user
                              </button>
                            )}
                            <button onClick={handleMakeUserAdmin} className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-green-500 hover:border-none mr-2">
                              Make Admin
                            </button>
                          </>
                        )}
                      </>
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
            <ConfirmDialog
              isOpen={showRemoveAdminConfirm}
              onClose={() => setShowRemoveAdminConfirm(false)}
              onConfirm={handleRemoveAdmin}
              title="Remove admin?"
              message={`Remove admin privileges from ${name || 'this user'}? They will no longer have admin access.`}
              confirmLabel="Remove Admin"
            />
            <ConfirmDialog
              isOpen={showBlockConfirm}
              onClose={() => setShowBlockConfirm(false)}
              onConfirm={handleBlockUser}
              title="Block user?"
              message={`${name || 'This user'} will not be able to sign in or use the app until unblocked.`}
              confirmLabel="Block"
            />
            <ConfirmDialog
              isOpen={showUnblockConfirm}
              onClose={() => setShowUnblockConfirm(false)}
              onConfirm={handleUnblockUser}
              title="Unblock user?"
              message={`${name || 'This user'} will be able to sign in and use the app again.`}
              confirmLabel="Unblock"
            />
            <AnnouncementContainer />
        </div>
    );
};

export default UserProfile;
