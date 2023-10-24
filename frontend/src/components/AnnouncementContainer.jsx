import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAllAnnouncementsQuery } from "../redux";
import Announcement from "./Announcement";
import { Loader } from "../components";

const AnnouncementContainer = () => {
	const location = useLocation();
	// Use the useAllAnnouncementsQuery hook to get all announcements
	const { data: announcements, isLoading: isFetching } =
		useAllAnnouncementsQuery();

	// Use the useSelector hook to access redux store state
	const { userInfo } = useSelector((state) => state.auth);

	// Create a variable to store the user's level
	const userLevel = userInfo?.level;

	// Create an object to group announcements by level
	const groupedAnnouncements = {
		"General": [],
		// [userLevel]: [],
	};

	if (announcements) {
    announcements.forEach((announcement) => {
      const level = announcement.level;
      if ((userLevel && level === userLevel)) {
        if (!groupedAnnouncements[level]) {
          groupedAnnouncements[level] = [];
        }
        groupedAnnouncements[level].push(announcement);
      } else if (level === "Non-Student") {
        // Add "Non-Student" announcements to the "General" section
        groupedAnnouncements["General"].push(announcement);
      }
    });
  }

  // Sort announcements within each group by createdAt in descending order
  for (const level in groupedAnnouncements) {
    groupedAnnouncements[level].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  // Get the keys and sort them, with "General" first
  const sortedKeys = Object.keys(groupedAnnouncements).sort((a, b) => {
    if (a === "General") {
      return -1;
    }
    if (b === "General") {
      return 1;
    }
    return a.localeCompare(b);
  });

	return (
		<div className={location.pathname === '/announcements' ? "border-gray-300 border-l-2 p-4 md:flex flex-col gap-1 mb-6" : "border-gray-300 border-l-2 p-4 md:flex flex-col gap-1 hidden mb-4 xl:w-[360px]"}>
			<h1 className="text-3xl font-bold py-2 border-b-2 ">
				Announcements
			</h1>
			{ isFetching && <Loader />}
			{sortedKeys.map((level) => (
        <div className="bg-greyish rounded-[2rem] p-4 my-4" key={level}>
          <h2 className="border-b-2 text-xl font-bold py-3">
            {level} {level !== "General" && "Level"} Announcements
          </h2>
          {groupedAnnouncements[level].map((announcement) => (
            <Announcement
              key={announcement._id}
              name={announcement.user.name}
              text={announcement.text}
              isVerified={announcement.user.isVerified}
              createdAt={announcement.createdAt}
            />
          ))}
        </div>
      ))}
		</div>
	);
};

export default AnnouncementContainer;
