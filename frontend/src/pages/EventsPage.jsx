import { NavBar, Footer } from "../components";
import Event from "../components/Event";
import { motion } from "framer-motion";
import { EventListSkeleton } from "../components/skeletons";

import { useAllEventsQuery } from "../redux";

const EventsPage = () => {
	const { data, isLoading } = useAllEventsQuery();

	return (
		<motion.main
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
		>
			<NavBar />
			<div className="p-5">
				<div className="flex flex-col pt-24 pb-5">
					<h1 className="text-3xl font-bold text-center pb-5">
						Upcoming Events
					</h1>
				</div>
				{isLoading ? (
					<div className="py-10">
						<EventListSkeleton count={4} />
					</div>
				) : data && data.length > 0 ? (
					<div className="flex flex-row flex-wrap gap-5 justify-center py-10">
					{data?.map((event, index) => (
							<Event
								key={index}
								image={event?.image}
								location={event?.location}
								title={event?.title}
								date={event?.date}
							/>
						))}
					</div>
					) : (
						<div className="flex flex-col justify-center items-center">
							<h1 className="text-xl font-bold text-center pb-5">
								No events found
							</h1>
							<p className="text-lg text-center pb-5">
								Please check back later
							</p>
						</div>
					)}
			</div>
			<Footer />
		</motion.main>
	);
};

export default EventsPage;
