const UsersCard = ({ index, name, username, points}) => {
	return (
		<div className="flex flex-row gap-3 items-center p-3 md:px-5 px-2 sm:justify-between justify-between bg-greyish w-[90%] m-auto my-2">
			<div className="font-bold">No {index + 1}</div>
			<div className="">
				{name.length > 10 ? <div>{name.slice(0, 10)}...</div> : name}
			</div>
			<div className="">
				{" "}
				{username.length > 10 ? (
					<div>{username.slice(0, 10)}...</div>
				) : (
					username
				)}
			</div>
			<div className="text-xl font-semibold">{points} <span className="text-sm font-normal">points</span></div>
		</div>
	);
};

export default UsersCard;
