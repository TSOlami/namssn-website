import { FaCircleCheck } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
	EditProfileForm,
	Post,
	Sidebar,
	AnnouncementContainer,
	Loader,
	VerifyAccountForm,
} from "../components";
import { ProfileImg } from "../assets";
import { useUserPostsQuery, setPosts } from "../redux";
import { motion } from "framer-motion";

const Profile = () => {
	// Fetch user info from redux store
	const { userInfo } = useSelector((state) => state.auth);
	const name = userInfo?.name;
	const username = userInfo?.username;
	const bio = userInfo?.bio;
	const isVerified = userInfo?.isVerified;
	const points = userInfo?.points;
	const profileImage = userInfo?.profilePicture;

	// Fetch number of posts from redux store
	const noOfPosts = userInfo?.posts?.length;
	console.log(noOfPosts)

	const dispatch = useDispatch();

	// Fetch user posts from redux store
	const { data: userPosts, isLoading } = useUserPostsQuery({
		_id: userInfo?._id,
	});

	// Use useEffect to set posts after component mounts
	useEffect(() => {
		if (userPosts) {
			dispatch(setPosts(userPosts));
		}
	}, [dispatch, userPosts]);

	// Manage modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	// Manage verify modal state
	const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
	const handleVerifyModal = () => {
		setIsVerifyModalOpen(!isVerifyModalOpen);
	};

	// Display loading indicator while data is being fetched
	if (isLoading) {
		return <Loader />;
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			className="flex flex-row"
		>
			<Sidebar />
			<div className="w-full min-w-[370px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] wide:w-[850px]">
				<div className="p-3 pl-6 flex flex-col">
					<span className="font-semibold text-black text-lg">
						{name}
					</span>
					<span>
						{noOfPosts} {noOfPosts === 1 ? "post" : "posts"}
					</span>
				</div>
				{/* profile image and cover image */}
				<div className="w-full h-32 bg-primary z-[-1]"></div>
				<div className="flex flex-row justify-between items-center relative top-[-40px] my-[-30px] p-3 pl-6 z-[0]">
					<img
						src={profileImage || ProfileImg}
						alt="avatar"
						className="profile-image"
					/>{" "}
					<button
						onClick={handleModal}
						className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-primary hover:border-none mt-auto"
					>
						Edit Profile
					</button>
					{!isVerified && (
						<button
						onClick={handleVerifyModal}
						className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-primary hover:border-none mt-auto"
					>
						Verify Account
					</button>	
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
					<span className="font-semibold text-xl">{points}</span>{" "}
					points
				</div>

				<div className="px-3 pt-3 border-b-2 pl-6 text-primary">
					<span className="border-b-4 border-primary">Posts</span>
				</div>
				<div>
					{userPosts && userPosts?.length === 0 ? ( // Check if userPosts is defined and has no posts
						<div className="text-center mt-28 p-4 text-gray-500">
							No posts to display.
						</div>
					) : (
						userPosts?.map(
							(
								post
							) => (
								<Post
									key={post._id}
									upvotes={post.upvotes.length}
									downvotes={post.downvotes.length}
									isVerified={isVerified}
									text={post.text}
									name={name}
									username={username}
									avatar={profileImage}
									createdAt={post.createdAt}
									image={post.image}
									postId={post._id}
									u_id={userInfo._id}
								/>
							)
						)
					)}
				</div>
			</div>
			<AnnouncementContainer />

			{/* modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
					<EditProfileForm handleModal={handleModal} />
				</div>
			)}

			{/* verify modal */}
			{isVerifyModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
					<VerifyAccountForm handleVerifyModal={handleVerifyModal} />
				</div>
			)}
		</motion.div>
	);
};

export default Profile;
