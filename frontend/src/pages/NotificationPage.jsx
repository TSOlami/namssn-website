import { AnnouncementContainer, BottomNav, Notification, Sidebar } from "../components";
import HeaderComponent from "../components/HeaderComponent";
import { mockReplies } from "../data";

const NotificationPage = () => {
	return (
		<div className="flex flex-row">
			<Sidebar />
			<div>
				<HeaderComponent title="Notifications" />
				{mockReplies.map((item, index) => {
					return (
						<Notification
							key={index}
							content={item.content}
							downvote={item?.downvote}
							upvote={item.upvote}
							name={item.name}
							isAdmin={item?.isAdmin}
							username={item.username}
							comment={item.comment}
							avatar={`src/assets/images/${item.avatar}.png`}
						/>
					);
				})}
			</div>
			<AnnouncementContainer />
			<BottomNav/>
		</div>
	);
};

export default NotificationPage;
