
const Event = ({image, description, date, location}) => {
	return (
		<div className="flex flex-row">
			<div>
				<img src={image} alt="" className="rounded-l-2xl" />
			</div>

      <div className="bg-black text-white flex flex-col items-center justify-center px-5 rounded-r-2xl">
        <h3 className="text-lg sm:text-2xl font-semibold py-1 sm:py-3">{description}</h3>
        <div>{date} <span className="w-2 h-2 inline-block bg-primary rounded-full mx-3"></span> {location}</div>
      </div>
		</div>
	);
};

export default Event;
