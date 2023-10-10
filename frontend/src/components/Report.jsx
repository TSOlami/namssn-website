const Report = ({ avatar, name, username, matric, ignore, suspend }) => {
	return (
		<div className="flex flex-row justify-between w-full p-2">
			<div className="flex flex-row gap-4 items-center">
				<div>
					<img src={avatar} alt="" />
				</div>
				<div>{name}</div>
			</div>

			<div>@{username}</div>
			<div>{matric}</div>

			<div className="flex flex-row gap-4">
				<button onClick={ignore} className="px-2 rounded-md border-2 border-gray-300">Ignore</button>
				<button onClick={suspend} className="text-white bg-red-600 rounded-md px-3">Suspend Account</button>
			</div>
		</div>
	);
};

export default Report;
