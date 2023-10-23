import { useEffect } from "react";
import { AiFillCaretRight } from "react-icons/ai";

const AdminEventsCard = ({ title, flier }) => {
	useEffect(() => {
		const clickHandler = (event) => {
			document
				.querySelectorAll("#event-card")
				.forEach((card) => card.classList.remove("border-l-4"));
			event.target.classList.add("rounded-l-none");
			event.target.classList.add("ml-2");
			event.target.classList.add("border-l-4");
			event.target.classList.add("border-primary");
			event.target.classList.add("rounded-l-none");
		};
	
		document.querySelectorAll("#event-card").forEach((card) => {
			card.addEventListener("click", clickHandler);
		});
	
		// Define the cleanup function
		const cleanup = () => {
			document.querySelectorAll("#event-card").forEach((card) => {
				card.removeEventListener("click", clickHandler);
			});
		};
	
		// Return the cleanup function
		return cleanup;
	}, []);
	
	return (
		<div className="text-black bg-greyish flex gap-2 rounded-lg p-2 px-4 m-4 items-center cursor-pointer hover:scale-105 active:scale-95" id="event-card">
			<div>
				<img src={flier} alt="" />
			</div>

			<div className="text-lg text-black">{title}</div>

			<div className="pl-5 ml-auto">
				<AiFillCaretRight />
			</div>
		</div>
	);
};

export default AdminEventsCard;
