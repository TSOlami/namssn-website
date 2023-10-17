import { Link } from "react-router-dom";
import { AdminCard, RecentPayments, Sidebar } from "../components";
import { HeaderComponent } from "../components";
import { mockAccounts, mockRecentPayments } from "../data";
import { MembersImg } from "../assets";
import { Avatar } from "../assets";

const AdminDashboard = () => {
	return (
		<div className="flex flex-row w-full">
			<Sidebar />
			<div className="w-full">
				<HeaderComponent title="Dashboard" />
				<div>
					<div className="flex flex-row gap-4 md:justify-between justify-center flex-wrap p-5">
						<AdminCard
							title="Total Payments"
							amount="320"
							card="payment"
							bg="orangish"
							route="/admin/payment"
						/>

						<AdminCard
							title="Blogs"
							amount="12"
							card="blog"
							bg="blueish"
						/>

						<AdminCard
							title="Events"
							amount="21"
							card="events"
							bg="reddish"
							route="/admin/events"
						/>

						<AdminCard
							title="Announcements"
							amount="12"
							card="announcements"
							bg="greenish"
							route="/admin/announcements"
						/>
					</div>
				</div>
				<div className="p-5 flex flex-row flex-wrap gap-4 items-center justify-center lg:justify-normal">
					<div className="bg-yellow-100 w-fit  p-4 rounded-xl">
						<h2 className="text-xl font-semibold">
							Team Members{" "}
							<img
								src={MembersImg}
								alt=""
								className="inline pl-5"
							/>{" "}
						</h2>
						<div className="flex flex-row justify-between m-2 rounded-md border-gray-500 border-2 p-1">
							1. Principal Offices of the department <span></span>
							<Link className="ml-5 bg-black px-2 rounded-md text-white">
								View
							</Link>
						</div>
						<div className="flex flex-row justify-between m-2 rounded-md border-gray-500 border-2 p-1">
							<span>2. NAMSSN Executives </span>
							<Link className="ml-5 bg-black px-2 rounded-md text-white">
								View
							</Link>
						</div>
						<div className="flex flex-row justify-between m-2 rounded-md border-gray-500 border-2 p-1">
							<span>3. NAMSSN Tech Team </span>
							<Link className="ml-5 bg-black px-2 rounded-md text-white">
								View
							</Link>
						</div>
					</div>

					{/* respected card */}
					<div className="bg-green-100 w-fit p-4 rounded-xl">
						<h2>Top Respected Accounts</h2>

						{/* Table */}
						<div>
							<table className="min-w-full shadow-md rounded-lg overflow-hidden">
								<thead className="">
									<tr>
										<th className="px-2 md:px-4 py-2 text-left font-semibold text-gray-700">
											NO
										</th>
										<th className="px-2 md:px-4 py-2 text-left font-semibold text-gray-700">
											Name
										</th>
										<th className="px-2 md:px-4 py-2 text-left font-semibold text-gray-700">
											Reputations
										</th>
										<th className="px-2 md:px-4 py-2 text-left font-semibold text-gray-700"></th>
									</tr>
								</thead>
								<tbody>
									{mockAccounts.map((account, index) => (
										<tr key={index}>
											<td className="px-2 md:px-4 py-2 whitespace-nowrap">
												{index + 1}
											</td>
											<td className="px-2 md:px-4 py-2 whitespace-nowrap">
												{account.name}
											</td>
											<td className="px-2 md:px-4 py-2 whitespace-nowrap">
												{account.reputation}
											</td>
											<td className="px-2 md:px-4 py-2 whitespace-nowrap">
												<Link
													to={account.verify}
													className="ml-5 bg-primary px-2 md:px-4 rounded-md text-white"
												>
													View
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				{/* Reported section */}
				{/*<h3 className="font-bold text-2xl p-4">Reported Accounts</h3>
				<div className="w-full px-4">
					{mockReportedAccounts.map((account, index) => (
						<Report
							key={index}
							avatar={`src/assets/images/${account.avatar}`}
							name={account.name}
							username={account.username}
							matric={account.matric}
							ignore={account.ignore}
							suspend={account.suspend}
						/>
					))}
				</div> */}

				{/* Recent payments */}
				<div className="flex flex-row justify-between pr-10">
					<h3 className="font-bold text-2xl p-4">Recent Payments</h3>
					<button className="text-primary">See more</button>
				</div>
				<div className="w-full px-4">
					{mockRecentPayments.map((payment, index) => (
						<RecentPayments
							key={index}
							name={payment.name}
							username={payment.username}
							matric={payment.matric}
							amount={payment.amount}
							details={payment.details}
							avatar={Avatar}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
