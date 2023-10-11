import { FaCircleCheck } from "react-icons/fa6";
import { Post, Sidebar, AnnouncementContainer } from "../components";
import Wrapper from "../assets/images/wrapper.png";
import { mockTexts } from "../data";
import { useState } from "react";
import { useSelector } from "react-redux";

import { EditProfileForm } from "../components";
import { ProfileImg } from "../assets";

const Profile = () => {
	// Fetch user info from redux store
	const { userInfo } = useSelector((state) => state.auth);
	const name = userInfo?.name;
	const username = userInfo?.username;
	const bio = userInfo?.bio;
	const isVerified = userInfo?.isVerified;
	// const isAdmin = userInfo?.role === 'admin';
	
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	const noOfPosts = 120;

	return (
		<div className="flex flex-row">
			<Sidebar />
			<div>
				<div className="p-3 pl-6 flex flex-col">
					<span className="font-semibold text-lg">
						{name}
					</span>
					<span>{noOfPosts} posts</span>
				</div>
				{/* profile image and cover image */}
				<div className="w-full h-32 bg-primary z-[-1]"></div>
				<div className="flex flex-row justify-between items-center relative top-[-30px] my-[-30px] p-3 pl-6 z-[0]">
					<img src={ProfileImg} alt="" />
					<button onClick={handleModal}className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-primary hover:border-none">
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
					<span className="font-semibold text-xl">215</span> points
				</div>

				<div className="px-3 pt-3 border-b-2 pl-6 text-primary"><span className="border-b-4 border-primary">Posts</span></div>
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



			{/* modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
					<EditProfileForm handleModal={handleModal} />
				</div>
			)
			}
		</div>
	);
};

export default Profile;
