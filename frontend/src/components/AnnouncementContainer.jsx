import { useLocation } from "react-router-dom";
import { mockAnnouncements } from "../data";
import Announcement from "./Announcement";

const AnnouncementContainer = () => {
	const location = useLocation();
	return (
		<div className={location.pathname === '/announcements' ? "border-gray-300 border-l-2 p-4 md:flex flex-col gap-1 mb-6" : "border-gray-300 border-l-2 p-4 md:flex flex-col gap-1 hidden mb-4"}>
			<h1 className="text-3xl font-bold py-2 border-b-2 ">
				Announcements
			</h1>
			<Announcement
				title="General Announcements"
				content={mockAnnouncements}
			/>
			<Announcement
				title="100l Announcements"
				content={mockAnnouncements}
			/>
		</div>
	);
};

export default AnnouncementContainer;
