import ProfileImg from "../assets/profileImg.png";
import { FaCameraRetro, FaCircleCheck, FaXmark } from "react-icons/fa6";
import { Post, Sidebar, AnnouncementContainer } from "../components";
import Wrapper from "../assets/images/wrapper.png";
import { mockTexts } from "../data";
import { useState } from "react";

const Profile = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	}
	const isAdmin = true;
	const noOfPosts = 120;

	return (
		<div className="flex flex-row">
			<Sidebar />
			<div>
				<div className="p-3 pl-6 flex flex-col">
					<span className="font-semibold text-lg">
						Ifedimeji Omoniyi
					</span>
					<span>{noOfPosts} posts</span>
				</div>
				{/* profile image and cover image */}
				<div className="w-full h-32 bg-primary z-[-1]"></div>
				<div className="flex flex-row justify-between items-center relative top-[-30px] my-[-30px] p-3 pl-6 z-[0]">
					<img src={ProfileImg} alt="" />
					<button onClick={handleModal}className="border-2 rounded-2xl border-gray-700 p-1 px-2 hover:text-white hover:bg-primary hover:border-none">
						Edit Profile
					</button>
				</div>
				<div className="flex flex-col text-sm p-3 pl-6">
					<span className="font-semibold flex flex-row items-center gap-2 text-lg">
						Ifedimeji Omoniyi
						{isAdmin && <FaCircleCheck color="#17A1FA" />}
					</span>
					<span>Design_Hashira</span>
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
						isAdmin={true}
						text={mockTexts}
						name="Ifedimeji Omoniyi"
						username="@design_hashira"
						avatar={Wrapper}
					/>
				</div>
			</div>
			<AnnouncementContainer />



			{/* modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
					<div className="bg-white rounded-2xl p-4 w-96">
						<div className="flex flex-row justify-between items-center">
							<span className="font-semibold text-lg">Edit Profile</span>
							<button onClick={handleModal} className="text-xl text-gray-700 hover:bg-black hover:text-white p-2 rounded-md">
								<FaXmark />
							</button>
						</div>
						<div className="flex flex-col gap-4 mt-4">
							<div className="scale-75 flex-row">
								<FaCameraRetro color="white" className="absolute left-[20%] bottom-[48%] scale-[2]"/>
								<img src={ProfileImg} alt=""/>
							</div>
							{/* <div>
								<label htmlFor="name">Name</label>
								<input
									type="text"
									name="name"
									id="name"
									className="border-2 rounded-lg border-gray-700 p-2 w-full"
									placeholder="New name"
								/>
							</div> */}
							<div>
								<label htmlFor="username">Username</label>
								<input
									type="text"
									name="username"
									id="username"
									className="border-2 rounded-lg border-gray-700 p-2 w-full"
									placeholder="New username"
								/>
							</div>
							<div>
								<label htmlFor="email">Email</label>
								<input
									type="email"
									name="email"
									id="email"
									className="border-2 rounded-lg border-gray-700 p-2 w-full"
									placeholder="New email"
								/>
							</div>
							<div>
								<label htmlFor="password">Password</label>
								<input
									type="password"
									name="password"
									id="password"
									className="border-2 rounded-lg border-gray-700 p-2 w-full"
									placeholder="New password"
								/>
							</div>
							<div>
								<button className="bg-primary text-white rounded-lg p-2 mt-2 w-full">
									Save
								</button>
							</div>
						</div>
					</div>
				</div>
			)
			}
		</div>
	);
};

export default Profile;
