import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAllAnnouncementsQuery } from "../redux";
import Announcement from "./Announcement";
import { AnnouncementListSkeleton } from "./skeletons";

const AnnouncementContainer = () => {
	const location = useLocation();
	const { data: announcements, isLoading: isFetching } =
		useAllAnnouncementsQuery();
	const { userInfo } = useSelector((state) => state.auth);
	const userLevel = userInfo?.level;

	const { groupedAnnouncements, sortedKeys } = useMemo(() => {
		const grouped = { General: [] };
		if (announcements) {
			announcements.forEach((announcement) => {
				const level = announcement.level;
				if (userLevel && level === userLevel) {
					if (!grouped[level]) grouped[level] = [];
					grouped[level].push(announcement);
				} else if (level === "Non-Student") {
					grouped["General"].push(announcement);
				}
			});
		}
		for (const level in grouped) {
			grouped[level].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		}
		const keys = Object.keys(grouped).sort((a, b) => {
			if (a === "General") return -1;
			if (b === "General") return 1;
			return a.localeCompare(b);
		});
		return { groupedAnnouncements: grouped, sortedKeys: keys };
	}, [announcements, userLevel]);

	const isFullPage = location.pathname === "/announcements";
	const containerClass = isFullPage
		? "border-gray-300 p-4 flex flex-col mb-6 max-w-4xl mx-auto w-full min-h-screen"
		: "w-[320px] flex-shrink-0 bg-gray-200 border-gray-300 p-4 md:flex flex-col gap-1 hidden mb-4";
	const scrollAreaClass = isFullPage
		? "announcement-scroll flex-1 min-h-0 overflow-y-auto flex flex-col gap-1"
		: "announcement-scroll max-h-[70vh] overflow-y-auto flex flex-col gap-1";

	return (
		<div className={containerClass}>
			<h1 className="text-3xl font-bold py-2 border-b-2 flex-shrink-0">
				Announcements
			</h1>
			<div className={scrollAreaClass}>
				{isFetching && <AnnouncementListSkeleton count={3} />}
				{!isFetching && sortedKeys.length === 0 && <p>No announcements</p>}
				{!isFetching && sortedKeys.map((level) => (
					<div className="bg-greyish rounded-[2rem] p-4 my-4" key={level}>
						<h2 className="border-b-2 text-xl font-bold py-3">
							{level} {level !== "General" && "Level"} Announcements
						</h2>
						{groupedAnnouncements[level]?.map((announcement) => (
							<Announcement
								key={announcement?._id}
								name={announcement?.user?.name}
								text={announcement?.text}
								isVerified={announcement?.user?.isVerified}
								createdAt={announcement?.createdAt}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default AnnouncementContainer;
