import { EventImg, MainEvent } from "../assets";
import { NavBar, Footer } from "../components";
import Event from "../components/Event";

const EventsPage = () => {
	return (
		<main>
			<NavBar />
			<div className="p-5">
				<div className="flex flex-col pt-24 pb-5">
					<h1 className="text-3xl font-bold text-center pb-5">
						Upcoming Events
					</h1>
					<div className="flex m-auto">
						<img src={MainEvent} alt="" />
					</div>
				</div>
				<div className="flex flex-row flex-wrap gap-5 justify-center py-10">
					<Event
						image={EventImg}
						description="NAMSSN year2 Vs MCB year 2"
						date="Septemeber 20"
						location="Sport center"
					/>
					<Event
						image={EventImg}
						description="NAMSSN year2 Vs MCB year 2"
						date="Septemeber 20"
						location="Sport center"
					/>
					<Event
						image={EventImg}
						description="NAMSSN year2 Vs MCB year 2"
						date="Septemeber 20"
						location="Sport center"
					/>
					<Event
						image={EventImg}
						description="NAMSSN year2 Vs MCB year 2"
						date="Septemeber 20"
						location="Sport center"
					/>
				</div>
			</div>
			<Footer />
		</main>
	);
};

export default EventsPage;
