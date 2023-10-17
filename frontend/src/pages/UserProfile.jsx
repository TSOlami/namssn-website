import { useParams } from 'react-router-dom';
import { FaCircleCheck } from "react-icons/fa6";


import { useGetUserQuery, useUserPostsQuery } from '../redux';
import { Loader, Post, Sidebar, AnnouncementContainer  } from '../components';
import { ErrorPage } from '../pages';
import { ProfileImg } from "../assets";

const UserProfile = () => {
  // Get the userId from the route params
	const { userId } = useParams();
	// // Fetch user info from redux store
	// const name = userInfo?.name;
	// const username = userInfo?.username;
	// const bio = userInfo?.bio;
	// const isVerified = userInfo?.isVerified;
	// // const isAdmin = userInfo?.role === 'admin';


  const { data: user, isLoading: userLoading  } = useGetUserQuery({ _id: userId });

  const { data: userPosts, isLoading: postsLoading  } = useUserPostsQuery({ _id: userId });

  // Display loading indicator while data is being fetched
  if (userLoading || postsLoading) {
    return <Loader />;
  }

  // Display error message if user is not found
  if (!user) {
    return <ErrorPage/>;
  }

  // console.log(user);
  const name = user?.name;
  const username = user?.username;
  const bio = user?.bio;
  const isVerified = user?.isVerified;
  const isAdmin = user?.role === 'admin';
  const points = user?.points;
	const noOfPosts = userPosts?.length;
  
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
					<img src={ProfileImg} alt="" className='profile-image' />
					{isAdmin && <button className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-green-500 hover:border-none ml-auto mr-2">
						Make admin
					</button>}
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
