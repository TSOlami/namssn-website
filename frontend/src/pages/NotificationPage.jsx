import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";	


import {
	AnnouncementContainer,
	BottomNav,
	Notification,
	Sidebar,
	HeaderComponent,
	ConfirmDialog,
} from "../components";
import { NotificationListSkeleton } from "../components/skeletons";
import {
	useGetNotificationsPagedQuery,
	useClearNotificationsMutation,
	setNotifications,
	logout,
	useLogoutMutation,
} from "../redux";
import { FaTrash } from "react-icons/fa6";
import { InfiniteScrollSentinel } from "../components/InfiniteScrollSentinel";

const NotificationPage = () => {
	const [page, setPage] = useState(1);
	const [items, setItems] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [showClearConfirm, setShowClearConfirm] = useState(false);

	// Paginated notifications from the backend
	const {
		data: notificationsPage,
		isLoading,
		isFetching,
		error,
	} = useGetNotificationsPagedQuery({ page, limit: 20 });

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
  }, [error, dispatch, logutUser, navigate]);

	// Use the hook to clear notifications from the backend
	const [clearNotifications] = useClearNotificationsMutation();

	// Merge paginated results into a single list
	useEffect(() => {
		if (!notificationsPage?.data) return;

		const { data, page: currentPage, totalPages } = notificationsPage;
		setItems((prev) => {
			if (currentPage === 1) return data;
			const existingIds = new Set(prev.map((n) => n._id));
			const newOnes = data.filter((n) => !existingIds.has(n._id));
			return [...prev, ...newOnes];
		});
		setHasMore(currentPage < (totalPages || 1));

		// keep Redux slice in sync for sidebar/unread badge
		dispatch(setNotifications(notificationsPage.data));
	}, [notificationsPage, dispatch]);

	const handleLoadMore = () => {
		if (isFetching || !hasMore) return;
		setPage((prev) => prev + 1);
	};

	// Clear notifications
	const handleClearNotifications = async () => {
		// Call the clearNotifications mutation to clear notifications
		try {
			await toast.promise(clearNotifications(), {
				pending: "Clearing notifications...",
				success: "Notifications cleared successfully!",
			});

			dispatch(setNotifications([]));
			setItems([]);
			setHasMore(false);
			setPage(1);
		} catch (err) {
			// Handle any errors if necessary
			toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
		}
		setShowClearConfirm(false);
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

				{/* Header actions row */}
				<div className="flex justify-end items-center px-4 py-3 border-b border-gray-200">
					{items.length > 0 && (
						<button
							onClick={() => setShowClearConfirm(true)}
							className="button-2 flex items-center gap-2 text-sm hover:opacity-80"
						>
							<FaTrash className="text-xs" />
							Clear all
						</button>
					)}
				</div>

				{isLoading && page === 1 ? (
					<NotificationListSkeleton count={6} />
				) : items.length === 0 ? (
					<div className="flex items-center justify-center text-lg w-full mt-20">
						No notifications to display.
					</div>
				) : (
					<div className="w-full">
						{items.map((notification, index) => {
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

						<InfiniteScrollSentinel
							onLoadMore={handleLoadMore}
							hasNextPage={hasMore}
							isLoadingMore={isFetching}
							className="h-10 w-full"
						/>
					</div>
				)}
				<div className="w-full h-20 md:hidden"></div>
			</div>
			<AnnouncementContainer />
			<BottomNav />
			<ConfirmDialog
				isOpen={showClearConfirm}
				onClose={() => setShowClearConfirm(false)}
				onConfirm={handleClearNotifications}
				title="Clear all notifications?"
				message={`You are about to delete all ${items.length} notification(s). This cannot be undone.`}
				confirmLabel="Clear all"
				variant="danger"
			/>
		</motion.div>
	);
};

export default NotificationPage;
