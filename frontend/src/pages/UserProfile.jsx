import { useParams } from 'react-router-dom';
import { FaCircleCheck } from "react-icons/fa6";


import { useGetUserQuery } from '../redux';
import { Loader, Post, Sidebar, AnnouncementContainer  } from '../components';
import Wrapper from "../assets/images/wrapper.png";
import { mockTexts } from "../data";
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


  const { data: user, isLoading } = useGetUserQuery({ _id: userId });
  if (!user) {
    return <div>User not found</div>;
  }

  // console.log(user);
  const name = user?.name;
  const username = user?.username;
  const bio = user?.bio;
  const isVerified = user?.isVerified;

	const noOfPosts = 120;
  
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
					<img src={ProfileImg} alt="" />
					<button className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-green-500 hover:border-none ml-auto mr-2">
						Make admin
					</button>
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
					<span className="font-semibold text-xl">215</span> points
				</div>
        {isLoading && <Loader />}
				<div className="px-3 pt-3 border-b-2 pl-6 text-primary">
					<span className="border-b-4 border-primary">Posts</span>
				</div>
				<div>
					<Post
						upvotes="3224"
						downvotes="30"
						shares="5"
						comments="10"
						isVerified={isVerified}
						text={mockTexts}
						name={name}
						username={username}
						image={Wrapper}
					/>
				</div>
			</div>
			<AnnouncementContainer />
		</div>
	);
};

export default UserProfile;