import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	AdminEventsCard,
	EventForm,
	HeaderComponent,
	Sidebar,
	Loader,
} from "../components";
import { useDispatch } from "react-redux";
import { useAllEventsQuery, setEvents } from "../redux";


const AdminEvents = () => {
	// Fetch all announcements
	const { data: events, isLoading: isFetching } = useAllEventsQuery();

	// State to manage selected event
	const [selectedEvent, setSelectedEvent] = useState(null);

	// Create a dispatch function
	const dispatch = useDispatch();

	// Handle data fetching and state updates
	useEffect(() => {
		if (events) {
			dispatch(setEvents(events));
		}
	}, [dispatch, events]);

	const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    const selectedEvent = events.find((event) => event._id === selectedId);
    setSelectedEvent(selectedEvent);
  };

	const handleCardClick = (id) => {
    const clickedEvent = events.find((event) => event._id  === id);
    setSelectedEvent(clickedEvent);
  };

  const handleClearSelection = () => {
    setSelectedEvent(null);
  };

	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			className="flex flex-row w-full"
		>
			<Sidebar />
			<div className="w-full flex flex-col">
				<HeaderComponent title="Events" back/>
				<div className="w-full flex md:flex-row flex-col">
					{/* Events section */}
					<div className="flex-1 md:block hidden">
						{events?.map((event, index) => (
							<AdminEventsCard
								key={index}
								id={event._id}
								title={event.title}
								date={event.date}
								location={event.location}
								flier={event.image}
								onClick={handleCardClick}
							/>
						))}

						{/* Add new event button */}
						{/* This should load an empty event form */}
						<button
						onClick={handleClearSelection}
						className="m-5 my-10 p-3 bg-primary text-white rounded-sm hover:opacity-80">
							Add New Event
						</button>
					</div>

					<div className="flex flex-col m-auto w-full items-center md:hidden">
						<select
							name=""
							id=""
							className="bg-black text-white w-[50%] p-2 rounded-lg"
							onChange={handleSelectChange}
						>
							<option value="" disabled>
              Select an event or create a new one
              </option>
							{/* Add an option for creating a new event */}
							<option value="createNewEvent">Create New Event</option>
							{events?.map((event, index) => (
								<option value={event._id} key={index}>
									{event.title}
								</option>
							))}
						</select>
					</div>

					{/*Event form */}
					<div className="flex-1 w-full border-gray-300 border-l-2 h-full">
						<EventForm
							selectedOption={selectedEvent}
						/>
					</div>
					{/* End of event form */}

					{ isFetching && <Loader />}
				</div>
			</div>
		</motion.div>
	);
};

export default AdminEvents;
