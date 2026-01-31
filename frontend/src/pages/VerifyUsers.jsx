// import { FaSearch } from "react-icons/fa";
import { HeaderComponent, Sidebar, UsersCard } from "../components";
import { UserListSkeleton } from "../components/skeletons";

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
				<HeaderComponent title="Respected Users" back/>
				<div className="w-full">
					{/* Search out the user */}
					{/* <div className="flex flex-row items-center">
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
					</div> */}

				</div>

				{/* Pagination listing most respected users*/}

				<h2 className="text-2xl font-semibold m-3 mt-14">
					Top Respected users
				</h2>

				<div>
				{isLoading ? (
					<UserListSkeleton count={10} />
				) : sortedUsers && sortedUsers.slice(0, 100).map((user, index) => (
					<UsersCard key={index} index={index} name={user.name} username={user.username} points={user.points} />
				))}
				</div>
			</div>
		</div>
	);
};

export default VerifyUsers;