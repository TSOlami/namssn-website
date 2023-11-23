import { AnnouncementContainer, BottomNav, Sidebar } from "../components";
import { motion } from "framer-motion";

const AnnouncementMobile = () => {
	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
		>
			<Sidebar />
			<BottomNav />
			<AnnouncementContainer />
		</motion.div>
	);
};

export default AnnouncementMobile;
