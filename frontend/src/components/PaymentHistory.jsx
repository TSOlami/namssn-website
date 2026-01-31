import {
	useUserPaymentsQuery,
	useVerifyUserPaymentsMutation,
	setPayments,
} from "../redux";
import { RecentPayments, PaymentVerificationForm } from ".";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { Sidebar, AnnouncementContainer } from ".";
import { ProfileSkeleton, PaymentListSkeleton } from "./skeletons";
import { ProfileImg, Wrapper } from "../assets";
import { motion } from "framer-motion";

const PaymentHistory = () => {
	// Fetch user info from redux store
	const { userInfo } = useSelector((state) => state.auth);
	const name = userInfo?.name;
	const mail = userInfo?.email;
	const matric = userInfo?.matricNumber;
	const profileImage = userInfo?.profilePicture;
	const [verificationResult, setVerificationResult] = useState(null);
		

	// Use your verification mutation
	const [verifyUserPayments] = useVerifyUserPaymentsMutation();
	//payment verication response handler

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

	// Fetch number of payments from redux store
	const dispatch = useDispatch();

	// Fetch user payments from redux store
	const { data: userPayments, isLoading } = useUserPaymentsQuery(
		{
			_id: userInfo?._id,
		},
		{
			select: {
				category: 1, // Only select the category field for population
				transactionReference: 1,
				// Add other fields you need
			},
			populate: "category", // Populate the category field
		}
	);

	// Use useEffect to set payments after component mounts
	useEffect(() => {
		if (userPayments) {
			dispatch(setPayments(userPayments));
		}
	}, [dispatch, userPayments]);

	// Manage modal state
	// Display loading indicator while data is being fetched
	if (isLoading) {
		return <Loader />;
	}

	// Function to handle payment verification

	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			className="flex flex-row"
		>
			<Sidebar />
			<div className="w-full min-w-[370px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] wide:w-[850px]">
				<div className="p-3 pl-6 flex flex-col">
					<span className="font-semibold text-black text-lg">
						{name}
					</span>
				</div>
				{/* profile image and cover image */}
				<div className="w-full h-32 bg-primary z-[-1]"></div>
				<div className="flex flex-row justify-between items-center relative top-[-30px] my-[-30px] p-3 pl-6 z-[0]">
					<img
						src={profileImage || ProfileImg}
						alt="avatar"
						className="profile-image"
					/>{" "}
				</div>

				<div className="p-5">
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
									<p>Amount: #{verificationResult.amount}</p>
									<p>Channel: {verificationResult.method}</p>
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

				<div className="px-3 pt-3 border-b-2 pl-6 text-primary">
					<span className="border-b-4 border-primary">payments</span>
				</div>

				<div>
					{userPayments && userPayments?.length === 0 ? (
						<div className="text-center mt-28 p-4 text-gray-500">
							No payments to display.
						</div>
					) : (
						userPayments?.map((payment) => (
							<RecentPayments
								key={payment._id}
								email={mail}
								matricNo={matric}
								createdAt={payment.createdAt}
								image={Wrapper}
								amount={payment.category.amount} // Access category.amount
								reference={payment.transactionReference} // Access transactionReference
								u_id={userInfo._id}
								category={payment.category.name} // Access category.name
							/>
						))
					)}
				</div>
			</div>
			)}
			<AnnouncementContainer />
		</motion.div>
	);
};
export default PaymentHistory;
