import { FaSearch } from "react-icons/fa";
import { HeaderComponent, Sidebar, UsersCard, Loader } from "../components";
import { Avatar } from "../assets";

import { useGetAllUsersQuery } from "../redux";

const VerifyUsers = () => {
	// Use the useGetAllUsersQuery hook to get all users
	const { data: users, isLoading } = useGetAllUsersQuery();
  
	// Sort users by points in descending order
  const sortedUsers = users && [...users].sort((a, b) => b.points - a.points);

	return (
		<div className="flex flex-row">
			<Sidebar />
			<div className="w-full">
				<HeaderComponent title="Verify Users" back/>
				<div>
					{/* Search out the user */}
					<div className="flex flex-row items-center">
						<input
							type="text"
							placeholder="Search User"
							name="user"
							id="user"
							className="border-2 text-xl p-2 rounded-md m-4 w-[400px]"
						/>
						<button className="text-2xl cursor-pointer hover:scale-125">
							<FaSearch />
						</button>
					</div>

					{/* display results */}

					<div className="flex flex-row gap-5 items-center p-4 bg-greyish">
						<div>
							<img src={Avatar} alt="" />
						</div>
						<div className="text-xl">Ifedimeji Omoniyi</div>
						<div className="text-lg">@design_hashira</div>
						<div className="text-xl font-semibold">20 Points</div>
						<div className="flex flex-row gap-3">
							<button className="p-2 px-3 rounded-lg bg-green-500 text-white hover:opacity-80">
								Verify
							</button>
							<button className="p-2 px-3 rounded-lg bg-red-500 text-white hover:opacity-80">
								Unverify
							</button>
						</div>
					</div>
				</div>

				{/* Pagination listing most respected users*/}

				<h2 className="text-2xl font-semibold m-3 mt-14">
					Top Respected users
				</h2>

				<div>
				{sortedUsers && sortedUsers.slice(0, 10).map((user, index) => (
					<UsersCard key={index} index={index} name={user.name} username={user.username} points={user.points} />
				))}
				</div>
			</div>
			{/* Loader */}
			{isLoading && <Loader />}
		</div>
	);
};

export default VerifyUsers;