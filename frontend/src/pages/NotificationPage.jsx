import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import {
	AnnouncementContainer,
	BottomNav,
	Notification,
	Sidebar,
	HeaderComponent,
	Loader,
} from "../components";
import { useGetNotificationsQuery, useClearNotificationsMutation, setNotifications } from "../redux";

const NotificationPage = () => {
	// Use the hook to get notifications from the backend
	const { data: notifications, isLoading } = useGetNotificationsQuery();

	// Use the hook to clear notifications from the backend
	const [clearNotifications] = useClearNotificationsMutation();

	// Use the hook to dispatch actions
	const dispatch = useDispatch();

	console.log("Notifications: ",notifications);

	// Clear notifications
	const handleClearNotifications = async () => {
    // Call the clearNotifications mutation to clear notifications
    try {
      await clearNotifications();
			// If successful, show a toast notification
			dispatch(setNotifications([]));
			toast.success("Notifications cleared successfully!");
    } catch (error) {
      // Handle any errors if necessary
			toast.error("Failed to clear notifications!");
      console.error("Failed to clear notifications:", error);
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
			<div>
				<HeaderComponent title="Notifications" />
				{notifications?.length === 0 && !isLoading ? (
          <p>No notifications to display.</p>
        ) : (
					<div> 
						<button onClick={handleClearNotifications} className="button-2">
							Clear Notifications
						</button>
          {notifications?.map((notification, index) => {
            return (
              <Notification
                key={index}
                content={notification.text}
                downvote={notification?.downvote}
                upvote={notification.upvote}
                name={notification.triggeredBy.name}
                isVerified={notification?.triggeredBy.isVerified}
                username={notification.triggeredBy.username}
                comment={notification.comment}
                avatar={notification.triggeredBy.profilePicture}
              />
						
            );
          })}
				</div>	
        )}
			</div>
			<AnnouncementContainer />
			{isLoading && <Loader />}
			<BottomNav />
		</motion.div>
	);
};

export default NotificationPage;
