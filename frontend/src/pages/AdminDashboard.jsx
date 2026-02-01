import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminCard, RecentPayments, Sidebar } from "../components";
import { HeaderComponent, SendMailModal } from "../components";
import { AdminCardSkeleton, PaymentListSkeleton, TableSkeleton } from "../components/skeletons";
import { MembersImg } from "../assets";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import {
	useGetAllUsersQuery,
	useGetAllPaymentsQuery,
	setPayments,
} from "../redux";
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

	const { data: users } = useGetAllUsersQuery();

	const [isSendMailModalOpen, setIsSendMailModalOpen] = useState(false);

	const sortedUsers = users && [...users].sort((a, b) => b.points - a.points);

	const dispatch = useDispatch();
	const { data: allpayments } = useGetAllPaymentsQuery({
		select: {
			category: 1,
			user: 1,
			transactionReference: 1,
		},
		populate: ["category", "user"],
	});

	useEffect(() => {
		if (allpayments) {
			dispatch(setPayments(allpayments));
		}
	}, [dispatch, allpayments]);

	const isLoadingStats = !totalPayments && !totalUsers && !totalBlogs && !totalEvents && !totalAnnouncements;
	const isLoadingUsers = !users;
	const isLoadingPayments = !allpayments;

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
						{isLoadingStats ? (
							<>
								<AdminCardSkeleton />
								<AdminCardSkeleton />
								<AdminCardSkeleton />
								<AdminCardSkeleton />
								<AdminCardSkeleton />
							</>
						) : (
							<>
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

								<AdminCard
									title="E-Test"
									amount="Manage"
									card="users"
									bg="bg-slate-100"
									route="/admin/e-test"
								/>
							</>
						)}
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
							<Link
								to="/about-us"
								className="ml-5 bg-black px-2 rounded-md text-white"
							>
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
							{isLoadingUsers ? (
								<TableSkeleton rows={6} columns={4} />
							) : (
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
										{sortedUsers &&
											sortedUsers
												.slice(0, 6)
												.map((account, index) => (
													<tr key={index}>
														<td className="px-2 md:px-4 py-2 whitespace-nowrap">
															{index + 1}
														</td>
														<td className="px-2 md:px-4 py-2 whitespace-nowrap">
															{account.name}
														</td>
														<td className="px-2 md:px-4 py-2 whitespace-nowrap">
															{account.points}
														</td>
														<td className="px-2 md:px-4 py-2 whitespace-nowrap">
															<Link
																to={`/profile/${account._id}`}
																className="ml-5 bg-primary px-2 md:px-4 rounded-md text-white"
															>
																View
															</Link>
														</td>
													</tr>
												))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>

				{/* Add a button to open the SendMailModal */}
				{!isSendMailModalOpen && (
					<button
						onClick={() => setIsSendMailModalOpen(true)}
						className="bg-primary m-3 text-white p-2 rounded-md"
					>
						Compose a mail notice
					</button>
				)}

				{/* Render the SendMailModal */}
				<SendMailModal
					isOpen={isSendMailModalOpen}
					onClose={() => setIsSendMailModalOpen(false)}
				/>

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
					{isLoadingPayments ? (
						<PaymentListSkeleton count={5} />
					) : allpayments && allpayments?.length === 0 ? (
						<div className="text-center mt-28 p-4 text-gray-500">
							No payments to display.
						</div>
					) : (
						allpayments?.map((payment) => (
							<RecentPayments
								key={payment._id}
								email={payment.user?.email}
								matricNo={payment.user?.matricNumber}
								createdAt={payment.createdAt}
								amount={payment.category?.amount}
								reference={payment.transactionReference}
								category={payment.category?.name}
							/>
						))
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default AdminDashboard;
