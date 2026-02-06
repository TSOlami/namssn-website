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
	const { userInfo } = useSelector((state) => state.auth);
	const name = userInfo?.name;
	const mail = userInfo?.email;
	const matric = userInfo?.matricNumber;
	const profileImage = userInfo?.profilePicture;
	const coverPhoto = userInfo?.coverPhoto;
	const [verificationResult, setVerificationResult] = useState(null);
	const [verifyUserPayments] = useVerifyUserPaymentsMutation();
	const dispatch = useDispatch();

	const handlePaymentVerification = async (transactionReference) => {
		try {
			const response = await verifyUserPayments({ transactionReference });
			if (response.data) {
				if (response.data.status === "success") {
					const { amount, method } = response.data;
					setVerificationResult({ success: true, amount, method });
				} else if (response.data.status === "failed") {
					setVerificationResult({
						success: false,
						error: "Payment not yet made Transaction verification failed.",
					});
				}
			} else {
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

	const { data: userPayments, isLoading } = useUserPaymentsQuery(
		{ _id: userInfo?._id },
		{ select: { category: 1, transactionReference: 1 }, populate: "category" }
	);

	useEffect(() => {
		if (userPayments) {
			dispatch(setPayments(userPayments));
		}
	}, [dispatch, userPayments]);

	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			className="flex flex-row"
		>
			<Sidebar />
			{(isLoading ? (
				<div className="w-full min-w-[370px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] wide:w-[850px]">
					<ProfileSkeleton />
					<PaymentListSkeleton count={5} />
				</div>
			) : (
			<div className="w-full min-w-[370px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] wide:w-[850px]">
				<div className="p-3 pl-6 flex flex-col">
					<span className="font-semibold text-black text-lg">
						{name}
					</span>
				</div>
				{/* profile image and cover image */}
				{coverPhoto ? (
					<div className="w-full h-32 z-[-1] overflow-hidden">
						<img
							src={coverPhoto}
							alt="Cover"
							className="w-full h-full object-cover"
							loading="lazy"
							decoding="async"
						/>
					</div>
				) : (
					<div className="w-full h-32 bg-primary z-[-1]"></div>
				)}
				<div className="flex flex-row justify-between items-center relative top-[-30px] my-[-30px] p-3 pl-6 z-[0]">
					<img
						src={profileImage || ProfileImg}
						alt="avatar"
						className="profile-image"
						loading="lazy"
					/>{" "}
				</div>

				<div className="p-5">
					<PaymentVerificationForm
						onVerify={handlePaymentVerification}
					/>
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
								amount={payment.category?.amount}
								reference={payment.transactionReference}
								u_id={userInfo?._id}
								category={payment.category?.name}
							/>
						))
					)}
				</div>
			</div>
			))}
			<AnnouncementContainer />
		</motion.div>
	);
};
export default PaymentHistory;
