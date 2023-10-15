import { FaCircleCheck } from "react-icons/fa6";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { EditProfileForm, Post, Sidebar, AnnouncementContainer, Loader } from "../components";
import { ProfileImg, Wrapper } from "../assets";
import { useUserPostsQuery, setPosts } from "../redux";

const Profile = () => {
	// Fetch user info from redux store
	const { userInfo } = useSelector((state) => state.auth);
	const name = userInfo?.name;
	const username = userInfo?.username;
	const bio = userInfo?.bio;
	const isVerified = userInfo?.isVerified;
	const points = userInfo?.points;

	// Fetch number of posts from redux store
	const noOfPosts = userInfo?.posts?.length;

	const dispatch = useDispatch();

	// Fetch user posts from redux store
	const { data: userPosts, isLoading } = useUserPostsQuery({ _id: userInfo?._id });

	// Set posts in redux store
	dispatch(setPosts(userPosts));

	// Manage modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	// Display loading indicator while data is being fetched
	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="flex flex-row">
			<Sidebar />
			<div>
				<div className="p-3 pl-6 flex flex-col">
					<span className="font-semibold text-black text-lg">{name}</span>
					<span>{noOfPosts} {noOfPosts === 1 ? 'post' : 'posts'}</span>
				</div>
				{/* profile image and cover image */}
				<div className="w-full h-32 bg-primary z-[-1]"></div>
				<div className="flex flex-row justify-between items-center relative top-[-30px] my-[-30px] p-3 pl-6 z-[0]">
					<img src={ProfileImg} alt="" />{" "}
					<button
						onClick={handleModal}
						className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-primary hover:border-none"
					>
						Edit Profile
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
					<span className="font-semibold text-xl">{points}</span> points
				</div>

				<div className="px-3 pt-3 border-b-2 pl-6 text-primary">
					<span className="border-b-4 border-primary">Posts</span>
				</div>
				<div>
          {userPosts?.map((post, index) => (
            <Post
              key={index}
              upvotes={post.upvotes.length}
              downvotes={post.downvotes.length}
              shares="5" // You may need to fetch the actual share count
              comments={post.comments.length}
              isVerified={isVerified}
              text={post.text}
              name={name}
              username={username}
              image={Wrapper}
            />
          ))}
        </div>
			</div>
			<AnnouncementContainer />

			{/* modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
					<EditProfileForm handleModal={handleModal} />
				</div>
			)}
		</div>
	);
};

export default Profile;
