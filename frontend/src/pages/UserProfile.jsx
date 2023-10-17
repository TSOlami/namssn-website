import { useParams } from 'react-router-dom';
import { FaCircleCheck } from "react-icons/fa6";
import { useSelector } from 'react-redux';

import { useGetUserQuery, useUserPostsQuery, useMakeUserAdminMutation, useRemoveAdminMutation } from '../redux';
import { Loader, Post, Sidebar, AnnouncementContainer  } from '../components';
import { ErrorPage } from '../pages';
import { ProfileImg } from "../assets";

const UserProfile = () => {
  // Get the userId from the URL
    const { userId } = useParams();

  // Get the current user from the redux store
  const currentUser = useSelector((state) => state.auth.userInfo);

  // Fetch user profile details from the server
  const { data: user, isLoading: userLoading  } = useGetUserQuery({ _id: userId });

  // Fetch user posts from the server
  const { data: userPosts, isLoading: postsLoading  } = useUserPostsQuery({ _id: userId });

  // Make user admin
  const [makeUserAdmin] = useMakeUserAdminMutation();

  // Remove admin
  const [removeAdmin] = useRemoveAdminMutation();

  // Handle make user admin
  const handleMakeUserAdmin = async () => {
    try {
      await makeUserAdmin(userId).unwrap();
      console.log('User is now an admin');
    } catch (error) {
      console.log(error);
    }
  };

  // Handle remove admin
  const handleRemoveAdmin = async () => {
    try {
      await removeAdmin(userId).unwrap();
      console.log('User is no longer an admin');
    } catch (error) {
      console.log(error);
    }
  };

  // Display loading indicator while data is being fetched
  if (userLoading || postsLoading) {
    return <Loader />;
  }

  // Display error message if user is not found
  if (!user) {
    return <ErrorPage/>;
  }
  // Get user profile details that was fetched from the server
  const name = user?.name;
  const username = user?.username;
  const bio = user?.bio;
  const isVerified = user?.isVerified;
  const isAdmin = user?.role === 'admin';
  const points = user?.points;
  const noOfPosts = userPosts?.length;
  const image = user?.profilePicture;

  const currentUserIsAdmin = currentUser?.role === 'admin';
  
    return (
        <div className="flex">
            <Sidebar />

            <div>
                <div className="p-3 pl-6 flex flex-col">
                    <span className="font-semibold text-lg">{name}</span>
                    <span>{noOfPosts} posts</span>
                </div>
                {/* profile image and cover image */}
                <div className="w-full h-32 bg-primary z-[-1]"></div>
                <div className="flex flex-row justify-between items-center relative top-[-30px] my-[-30px] p-3 pl-6 z-[0]">
                    <img src={image || ProfileImg} alt="" className="profile-image"/>
                    {currentUserIsAdmin && (
                        isAdmin ? (
                        <button onClick={handleMakeUserAdmin} className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-red-500 hover:border-none ml-auto mr-2">
                            Remove Admin
                        </button>
                        ) : (
                        <button onClick={handleRemoveAdmin} className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-green-500 hover:border-none ml-auto mr-2">
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
          {userPosts && userPosts.length === 0 ? ( // Check if userPosts is defined and has no posts
            <div className="text-center mt-28 p-4 text-gray-500">
              No posts to display.
            </div>
          ) : (
            userPosts?.map((post) => (
              <Post
                key={post._id}
                upvotes={post.upvotes.length}
                downvotes={post.downvotes.length}
                isVerified={isVerified}
                text={post.text}
                name={name}
                username={username}
                createdAt={post.createdAt}
                postId={post._id}
                u_id={user._id}
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
