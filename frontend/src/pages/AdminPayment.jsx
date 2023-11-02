import { useState, useEffect } from "react";
import {
	Sidebar,
	AddCategoryForm,
	DeleteCategoryForm,
	HeaderComponent,
	PaymentDetails,
	Loader,
	PaymentVerificationForm,
} from "../components";
import { FaCheck } from "react-icons/fa6";
import {
	useAllPaymentsQuery,
	useVerifyPaymentsMutation,
	useGetAllPaymentsQuery,
	setPayments,
} from "../redux"; //
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { formatDateToTime } from "../utils";

const AdminPayment = () => {
	const { data: payments, isLoading, isError } = useAllPaymentsQuery();
	const [verificationResult, setVerificationResult] = useState(null);

	// Manage modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	// Manage verify modal state
	const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
	const handleVerifyModal = () => {
		setIsVerifyModalOpen(!isVerifyModalOpen);
	};

	const dispatch = useDispatch();
	const { data: allpayments, Loading } = useGetAllPaymentsQuery({
		select: {
			category: 1, // Only select the category field for population
			user: 1,
			transactionReference: 1,
			// Add other fields you need
		},
		populate: ["category", "user"],
	});

	const [verifyUserPayments] = useVerifyPaymentsMutation();
	const handlePaymentVerification = async (transactionReference) => {
		try {
			const response = await verifyUserPayments({ transactionReference });

			if (response.data) {
				if (response.data.status === "success") {
					// Payment verification was successful
					const { amount, method } = response.data;
					setVerificationResult({ success: true, amount, method });
				} else if (response.data.status === "failed") {
					// Payment verification failed
					setVerificationResult({
						success: false,
						error: "Payment not yet made Transaction verification failed.",
					});
				}
			} else {
				// Handle verification failure
				setVerificationResult({
					success: false,
					error: "Failed to verify payment.",
				});
			}
		} catch (error) {
			console.error("Error verifying payment:", error);
			setVerificationResult({
				success: false,
				error: "Failed to verify payment.",
			});
		}
	};

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
			className="flex flex-row"
		>
			<Sidebar />

			<div className="w-full h-full">
				<HeaderComponent title="Payments" back />

				<div className="flex flex-row w-full h-full ">
					<div className="h-full w-[500px] ">
						<h1 className="text-2xl font-semibold p-4">Current Payments</h1>
						{isLoading ? (
							<p className="p-2">
								Loading payments...{" "}
								<span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mx-2" />
							</p>
						) : isError ? (
							<p>Error loading payments</p>
						) : !payments ||
					!Array.isArray(payments) ||
			payments.length === 0 ? (
							<p>No payments available.</p>
						) : (
							payments.map((payment, index) => (
								<PaymentDetails
									key={index}
									title={payment.name}
									amount={payment.amount}
								/>
							))
						)}

						<button
							className="m-5 my-10 p-2 rounded-md bg-primary text-white"
							onClick={handleModal}
						>
							Add New Payment
						</button>

						<button
							className="bg-red-600 text-white p-2 rounded-md"
							onClick={handleVerifyModal}
						>
							Delete Payment
						</button>
					</div>
				</div>

				{/* Payment details and breakdown section */}
				<div className="border-r-gray-300 border-l-2 h-full">
	
					{/* Payment details card */}
					{/* <div className="shadow-3xl flex flex-row w-[500px] justify-between items-center rounded-2xl m-8 p-4 gap-20 pr-14">
						<div className="flex flex-col">
							<p>
								Let&apos;s help NAMSSN grow by paying our
								departmental dues. Ensure you use your matric
								number as description for the transfer.{" "}
							</p>
							<div className="py-4 flex flex-row items-center gap-2">
								Amount :{" "}
								<span className="text-xl font-semibold">
									#{5000}
								</span>
							</div>
						</div>
						<div className="border-gray-500 border-2 rounded-xl flex flex-row p-2 text-xl font-semibold">
							<span className="pr-2">{50}</span> Paid
						</div>
					</div> */}

					{/* Payment verification form */}
					<div className="p-5 pb-10">
						<PaymentVerificationForm
							onVerify={handlePaymentVerification}
						/>
						{/* Display the verification result, if available */}
						{verificationResult !== null ? (
							<div className="verification-result">
								{verificationResult.success ? (
									<>
										<p>
											<strong>
												PAID <FaCheck />
											</strong>{" "}
											Payment successfully verified.
										</p>
										<p>
											Amount: #{verificationResult.amount}
										</p>
										<p>
											Channel: {verificationResult.method}
										</p>
									</>
								) : (
									<p>
										<strong>NOT PAID !</strong>{" "}
										{verificationResult.error}
									</p>
								)}
							</div>
						) : null}
					</div>

					{/* Payment details table */}

					<HeaderComponent
						title="Recent Payments"
						url={"placeholder"}
					/>

					<div className="pb-20">
						<table>
							<thead>
								<tr className="">
									<th className="px-2 mx-7 md:px-4 py-2 text-left font-semibold text-gray-700">
										No
									</th>
									<th className="px-2 mx-7 md:px-4 py-2 text-left font-semibold text-gray-700">
										E-mail
									</th>
									<th className="px-2 mx-7 md:px-4 py-2 text-left font-semibold text-gray-700">
										Matric NO
									</th>
									<th className="px-2 mx-7 md:px-4 py-2 text-left font-semibold text-gray-700">
										Category
									</th>
									<th className="px-2 mx-7 md:px-4 py-2 text-left font-semibold text-gray-700">
										Date
									</th>
									<th className="px-2 mx-7 md:px-4 py-2 text-left font-semibold text-gray-700">
										Reference No
									</th>
									<th className="px-4 mx-7 md:px-4 py-2 text-left font-semibold text-gray-700">
										Amount
									</th>
								</tr>
							</thead>
							<tbody>
								{allpayments?.map((payment, index) => (
									<tr key={index} className="">
										<td className="px-2 mx-7 md:px-4 py-2 whitespace-nowrap">
											{index + 1}
										</td>
										<td className="px-2 mx-7 md:px-4 py-2 whitespace-nowrap">
											{payment.user?.email}
										</td>
										<td className="px-2 mx-7 md:px-4 py-2 whitespace-nowrap">
											{payment.user?.matricNumber}
										</td>
										<td className="px-2 mx-7 md:px-4 py-2 whitespace-nowrap">
											{payment.category.name}
										</td>
										<td className="px-2 mx-7 md:px-4 py-2 whitespace-nowrap">
											{formatDateToTime(
												new Date(payment.createdAt)
											)}{" "}
											ago
										</td>
										<td className="px-2 mx-7 md:px-4 py-2 whitespace-nowrap">
											{payment.transactionReference}
										</td>
										<td className="px-2 mx-7 md:px-4 py-2  text-2xl font-semibold">
										₦	{payment.category.amount}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{/* <div>
						{allpayments && allpayments?.length === 0 ? (
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
									amount={payment.category.amount} // Access category.amount
									reference={payment.transactionReference} // Access transactionReference
									category={payment.category.name} // Access category.name
								/>
							))
						)}
					</div> */}
				</div>
			</div>
			{/* modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
					<AddCategoryForm handleModal={handleModal} />
				</div>
			)}

			{/* verify modal */}
			{isVerifyModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
					<DeleteCategoryForm handleVerifyModal={handleVerifyModal} />
				</div>
			)}
		</motion.div>
	);
};

export default AdminPayment;
