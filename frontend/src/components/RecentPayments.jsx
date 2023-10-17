const Report = ({ avatar, name, username, matric, amount, details }) => {
	return (
		<div className="flex flex-row items-center justify-between w-full p-1 px-5 pr-10 rounded-xl border-2 border-gray-200 m-2 my-4">
			<div className="flex flex-row gap-4 items-center">
				<div>
					<img src={avatar} alt="" />
				</div>
				<div>{name}</div>
			</div>

			<div>@{username}</div>
			<div>{matric}</div>
			<div className="">
				{details}
			</div>

			<div className="rounded-md font-semibold px-3 text-xl">
				{amount}
			</div>
		</div>
	);
};

export default Report;
