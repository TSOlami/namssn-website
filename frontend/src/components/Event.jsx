import { FaLocationDot } from "react-icons/fa6";

const Event = ({image, title, date, location}) => {
	return (
		<div className="flex flex-row">
			<div>
				<img src={image} alt="" className="rounded-l-2xl max-h-[500px]" />
			</div>

      <div className="bg-black text-white flex flex-col items-center justify-center px-5 rounded-r-2xl">
        <h3 className="text-lg sm:text-2xl font-semibold py-1 sm:py-3">{title}</h3>
        <div>{date} <span className="inline-block  mx-3"><FaLocationDot/></span> {location}</div>
      </div>
		</div>
	);
};

export default Event;
