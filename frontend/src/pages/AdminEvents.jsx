import {
	AdminEventsCard,
	EventForm,
	HeaderComponent,
	Sidebar,
} from "../components";
import { mockEvents } from "../data";

const AdminEvents = () => {
	return (
		<div className="flex flex-row w-full">
			<Sidebar />
			<div className="w-full flex flex-col">
				<HeaderComponent title="Events" />
				<div className="w-full flex flex-row">
					{/* Events section */}
					<div className="flex-1">
						{mockEvents.map((event, index) => (
							<AdminEventsCard
								key={index}
								title={event.title}
								flier={event.flier}
							/>
						))}


						{/* Add new event button */}
						{/* This should load an empty event form */}
						<button
							className="m-5 my-10 p-3 bg-primary text-white rounded-sm hover:opacity-80"
						>
							Add New Event
						</button>
					</div>

					{/*Event form */}
					<div className="flex-1 w-full border-gray-300 border-l-2 h-full">
						<EventForm />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminEvents;