import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminCard, RecentPayments, Sidebar, Loader} from "../components";
import { HeaderComponent } from "../components";
import { mockAccounts } from "../data";
import { MembersImg } from "../assets";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useGetAllPaymentsQuery,setPayments } from "../redux";


import {
	useGetTotalPaymentsQuery,
	useGetTotalUsersQuery,
	useGetTotalBlogsQuery,
	useGetTotalEventsQuery,
	useGetTotalAnnouncementsQuery,
} from "../redux";

const AdminDashboard = () => {
	const { data: totalPayments } = useGetTotalPaymentsQuery();
	const { data: totalUsers } = useGetTotalUsersQuery();
	const { data: totalBlogs } = useGetTotalBlogsQuery();
	const { data: totalEvents } = useGetTotalEventsQuery();
	const { data: totalAnnouncements } = useGetTotalAnnouncementsQuery();

	console.log("Total payments: ", totalPayments, "Total users: ", totalUsers, "Total blogs: ", totalBlogs, "Total events: ", totalEvents, "Total announcements: ", totalAnnouncements);

	const dispatch = useDispatch();
	const { data: allpayments, Loading } = useGetAllPaymentsQuery(
		{
		select: {
			category: 1, // Only select the category field for population
			user: 1,
			transactionReference: 1,
			// Add other fields you need
		},
		populate: ["category", "user"],
		}
	);
	
	useEffect(() => {
    if (allpayments) {
      dispatch(setPayments(allpayments));
    }
  }, [dispatch, allpayments]);
  if (Loading) {
		return <Loader />;
	}
	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			className="flex flex-row w-full"
		>
			<Sidebar />
			<div className="w-full">
				<HeaderComponent title="Dashboard" />
				<div>
					<div className="flex flex-row gap-4 md:justify-between justify-center flex-wrap p-5">
						<AdminCard
							title="Total Payments"
							amount={totalPayments}
							card="payment"
							bg="orangish"
							route="/admin/payment"
						/>

						<AdminCard
							title="Blogs"
							amount={totalBlogs}
							card="blog"
							bg="blueish"
							route="/admin/blogs"
						/>

						<AdminCard
							title="Events"
							amount={totalEvents}
							card="events"
							bg="reddish"
							route="/admin/events"
						/>

						<AdminCard
							title="Announcements"
							amount={totalAnnouncements}
							card="announcements"
							bg="greenish"
							route="/admin/announcements"
						/>

						<AdminCard
							title={"Users"}
							amount={totalUsers}
							card="users"
							bg="bg-purple-100"
							route="/admin/users"
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
					<Link to="/admin/payment">
						<button className="text-primary">See more</button>
					</Link>

				</div>
				{/* <div className="w-full px-4">
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
				</div> */}
				<div>
					{allpayments && allpayments?.length === 0 ? (
						<div className="text-center mt-28 p-4 text-gray-500">
							No payments to display.
						</div>
					) : (
						allpayments?.map((payment) => (
							<RecentPayments
								key={payment._id}
								email={payment.user.email}
								matricNo={payment.user.matricNumber}
								createdAt={payment.createdAt}
								amount={payment.category.amount} // Access category.amount
								reference={payment.transactionReference} // Access transactionReference
								category={payment.category.name} // Access category.name
							/>
						))
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default AdminDashboard;
