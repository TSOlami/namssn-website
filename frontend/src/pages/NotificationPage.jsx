import {
	AnnouncementContainer,
	BottomNav,
	Notification,
	Sidebar,
	HeaderComponent,
} from "../components";
import { mockReplies } from "../data";
import { motion } from "framer-motion";

const NotificationPage = () => {
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
			<BottomNav />
		</motion.div>
	);
};

export default NotificationPage;
