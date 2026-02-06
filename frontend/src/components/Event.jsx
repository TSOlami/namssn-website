import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaX } from "react-icons/fa6";
import { motion } from "framer-motion";

const Event = ({ image, title, date, location }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const handleExpand = () => {
		setIsExpanded(!isExpanded);
	};
	return (
		<div className="flex flex-row">
			<div>
				{/* The zoom in works with state that toggles between the normal image, and a fullscreen image that overlays the rest of the page. */}
				{image && (
					<div className="post-image-container pt-2">
						<img
							src={image}
							alt="Post Image"
							className="rounded-l-2xl max-h-[500px] cursor-pointer "
							loading="lazy"
							decoding="async"
							onClick={handleExpand}
						/>
					</div>
				)}
				{isExpanded && (
					<motion.div
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						className="fixed inset-0 z-[10000] bg-black/50 blur-filter flex p-3"
					>
						<img
							src={image}
							className="m-auto max-h-full max-w-full"
							loading="lazy"
							decoding="async"
						/>

						<button
							className="text-white text-3xl absolute right-10 top-5 bg-gray-800 p-3 rounded-lg"
							onClick={handleExpand}
						>
							<FaX />
						</button>
					</motion.div>
				)}
			</div>

			<div className="bg-black text-white flex flex-col items-center justify-center px-5 rounded-r-2xl">
				<h3 className="text-lg sm:text-2xl font-semibold py-1 sm:py-3">
					{title}
				</h3>
				<div>
					{date}{" "}
					<span className="inline-block  mx-3">
						<FaLocationDot />
					</span>{" "}
					{location}
				</div>
			</div>
		</div>
	);
};

export default Event;
