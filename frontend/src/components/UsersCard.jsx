const UsersCard = ({ index, name, username, points, verify, unverify, avatar }) => {
	return (
		<div className="flex flex-row gap-5 items-center p-3  px-5 justify-between bg-greyish w-[90%] m-auto my-2">
      <div className="font-bold">No {index + 1}</div>
			<div>
				<img src={avatar} alt="" />
			</div>
			<div className="text-xl">{name}</div>
			<div className="text-lg">{username}</div>
			<div className="text-xl font-semibold">{points} Points</div>
			<div className="flex flex-row gap-3">
				<button className="p-2 px-3 rounded-lg bg-green-500 text-white hover:opacity-80" onClick={verify}>
					Verify
				</button>
				<button className="p-2 px-3 rounded-lg bg-red-500 text-white hover:opacity-80" onClick={unverify}>
					Unverify
				</button>
			</div>
		</div>
	);
};

export default UsersCard;
