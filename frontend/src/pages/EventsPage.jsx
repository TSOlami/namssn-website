import { NavBar, Footer, Loader } from "../components";
import Event from "../components/Event";
import { motion } from "framer-motion";

import { useAllEventsQuery } from "../redux";

const EventsPage = () => {
	const { data, isLoading } = useAllEventsQuery();

	if (isLoading) {
		return <Loader />;
	}
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
				<div className="flex flex-row flex-wrap gap-5 justify-center py-10">
				{data.map((event, index) => (
            <Event
              key={index}
              image={event.image}
							location={event.location}
							title={event.title}
							date={event.date}
            />
          ))}
				</div>
			</div>
			<Footer />
		</motion.main>
	);
};

export default EventsPage;
