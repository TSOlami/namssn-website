import { FaSearch } from "react-icons/fa";
import { HeaderComponent, Sidebar, UsersCard } from "../components";
import { Avatar } from "../assets";
import { mockUsers } from "../data";

const VerifyUsers = () => {
	return (
		<div className="flex flex-row">
			<Sidebar />
			<div className="w-full">
				<HeaderComponent title="Verify Users" />
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
					{mockUsers.map((user, index) => (
						<UsersCard index={index} key={index} name={user.name} username={user.username} points={user.points} />
					))}
				</div>
			</div>
			<div></div>
		</div>
	);
};

export default VerifyUsers;
