import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";	


import {
	AnnouncementContainer,
	BottomNav,
	Notification,
	Sidebar,
	HeaderComponent,
} from "../components";
import { NotificationListSkeleton } from "../components/skeletons";
import {
	useGetNotificationsQuery,
	useClearNotificationsMutation,
	setNotifications,
	logout,
	useLogoutMutation,
} from "../redux";
import { FaTrash } from "react-icons/fa6";

const NotificationPage = () => {
	// Use the hook to get notifications from the backend
	const { data: notifications, isLoading, error } = useGetNotificationsQuery();

	// Use the navigate hook from the react-router-dom to navigate to a different route
	const navigate = useNavigate();

	// Use the hook to dispatch actions
	const dispatch = useDispatch();

	// Use the useLogoutMutation hook to logout a user
	const [logutUser] = useLogoutMutation();
	
  // Add a useEffect hook to check if a user is properly authenticated
  useEffect(() => {
    if (error?.status === 401) {
      // If the user is not authenticated, logout the user
      logutUser();
      // Dispatch the logout action
      dispatch(logout());
      toast.error("Sorry, You might need to login again.");
      navigate("/signin");
    }
  }, [error, dispatch, logutUser]);

	// Use the hook to clear notifications from the backend
	const [clearNotifications] = useClearNotificationsMutation();

	// Clear notifications
	const handleClearNotifications = async () => {
		// Call the clearNotifications mutation to clear notifications
		try {
			await toast.promise(
				clearNotifications(),
				{
					pending: "Clearing notifications...",
					success: "Notifications cleared successfully!",
				},
			);
			// If successful, show a toast notification
			dispatch(setNotifications([]));
		} catch (err) {
			// Handle any errors if necessary
			toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			className="flex flex-row"
		>
			<Sidebar />
			<div className="w-full relative">
				<HeaderComponent title="Notifications" />
				{isLoading ? (
					<NotificationListSkeleton count={6} />
				) : notifications?.length === 0 ? (
					<div className="flex items-center justify-center text-lg w-full mt-20">
						No notifications to display.
					</div>
				) : (
					<div className="w-full">
						<button
							onClick={handleClearNotifications}
							className="button-2 absolute hover:opacity-70 bottom-20 sm:bottom-16 right-[7vw] md:right-[5vw] lg:right-[20vw] cursor-pointer"
						>
							<FaTrash />
							Clear Notifications
						</button>
						{notifications?.map((notification, index) => {
							return (
								<Notification
									key={index}
									notificationId={notification?._id}
									content={notification?.text}
									downvote={notification?.downvote}
									upvote={notification?.upvote}
									tBUser={notification?.triggeredBy._id}
									name={notification?.triggeredBy?.name}
									isVerified={
										notification?.triggeredBy?.isVerified
									}
									username={
										notification?.triggeredBy?.username
									}
									post={notification?.post}
									comment={notification?.comment}
									avatar={
										notification?.triggeredBy?.profilePicture
									}
									createdAt={notification?.createdAt}
									seen={notification?.seen}
								/>
							);
						})}
					</div>
				)}
				<div className="w-full h-20 md:hidden"></div>
			</div>
			<AnnouncementContainer />
			<BottomNav />
		</motion.div>
	);
};

export default NotificationPage;
