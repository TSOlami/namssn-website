import { FaCircleCheck } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
	EditProfileForm,
	Post,
	Sidebar,
	AnnouncementContainer,
	Loader,
	VerifyAccountForm,
} from "../components";
import { ProfileImg } from "../assets";
import {
	useUserPostsQuery,
	logout,
	useLogoutMutation,
} from "../redux";
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

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Use the useLogoutMutation hook to logout a user
	const [logutUser] = useLogoutMutation();

	// Fetch user posts from redux store
	const { data: userPosts, isLoading, error } = useUserPostsQuery({
		_id: userInfo?._id,
	});

	
  // Add a useEffect hook to check if a user is properly authenticated
  useEffect(() => {
    if (error?.status === 401) {
      // If the user is not authenticated, logout the user
      logutUser();
      // Dispatch the logout action
      dispatch(logout());
      toast.error("Unauthorized, You might need to login again.");
      navigate("/signin");
    }
  }, [error, dispatch, logutUser]);
	
	// State for managing posts
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
				{/* Display a message for non-verified users */}
        {!isVerified && (
          <div className="border-b-2 border-gray-300 w-full bg-red-50 h-12 flex justify-center items-center">
            <span className="font-normal text-gray-700 text-center">
              Your account is not verified. Verifying your account helps build trust within the community and allows you to enjoy additional features. Click the &quot;Verify Account&quot; button to get started.
            </span>
          </div>
        )}
				{/* profile image and cover image */}
				<div className="w-full h-32 bg-primary z-[-1]"></div>
				<div className="flex flex-row justify-between items-center relative top-[-40px] my-[-30px] p-3 pl-6 z-[0]">
					<img
						src={profileImage || ProfileImg}
						alt="avatar"
						className="profile-image"
					/>{" "}
					<div className="flex flex-col gap-4">
					<button
						onClick={handleModal}
						className="border-2 rounded-2xl border-white text-white p-1 px-2 hover:text-primary bg-primary hover:bg-white hover:border-none mt-auto"
					>
						Edit Profile
					</button>
					{!isVerified && (
						<button
						onClick={handleVerifyModal}
						className="border-2 rounded-2xl border-gray-700 p-1 px-2 hover:text-white hover:bg-primary hover:border-none mt-auto"
					>
						Verify Account
					</button>	
					)}
					</div>
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
