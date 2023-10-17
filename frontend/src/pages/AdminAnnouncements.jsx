import { AdminAnnouncementCard, HeaderComponent, Sidebar } from "../components";
import { mockAnnouncements } from "../data";

const AdminAnnouncements = () => {
	return (
		<div className="flex flex-row w-full">
			<Sidebar />

			<div className="w-full">
				<HeaderComponent title="Announcements" />
				<div className="flex flex-row gap-2 w-full">
					<div className="flex-1">
						<AdminAnnouncementCard title="General Announcements" />
						<AdminAnnouncementCard title="100L Announcements" />
						<AdminAnnouncementCard title="200L Announcements" />
						<AdminAnnouncementCard title="300L Announcements" />
						<AdminAnnouncementCard title="400L Announcements" />
						<AdminAnnouncementCard title="500L Announcements" />
					</div>

					<div className="flex-1 border-l-2 border-l-gray-300">
						<form action="" className="flex flex-col gap-3 p-5">
							<textarea
								name=""
								placeholder="Type in a new annoucement"
								id=""
								className="resize-none border-2 border-gray-300 p-3 rounded-lg"
							></textarea>
							<button className="p-2 px-3 rounded-lg bg-black text-white">
								Add new Announcement
							</button>

							{/* The other annoucements map inside input fields where they can be edited and deleted directly */}
              <h3 className="text-xl font-semibold pt-8">
                Announcements
              </h3>
							{mockAnnouncements.map((announcement, index) => (
								<div
									key={index}
									className="flex flex-col gap-3 mb-4"
								>
									<textarea
										type="text"
										value={announcement.content}
										className="resize-none border-2 border-gray-300 p-3 rounded-lg"
									/>
									<div className="flex flex-row gap-5 ml-auto">
										<button className="p-2 px-3 rounded-lg bg-black text-white">
											Edit
										</button>
										<button className="p-2 px-3 rounded-lg bg-red-500 text-white">
											Delete
										</button>
									</div>
								</div>
							))}
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminAnnouncements;
