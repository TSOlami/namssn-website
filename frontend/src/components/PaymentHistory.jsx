import { useUserPaymentsQuery, setPayments } from "../redux";
import { RecentPayments } from ".";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Sidebar,
	AnnouncementContainer,
	Loader,
} from ".";
import { ProfileImg, Wrapper } from "../assets";
import { motion } from "framer-motion";

const PaymentHistory = () => {
	// Fetch user info from redux store
	const { userInfo } = useSelector((state) => state.auth);
	const name = userInfo?.name;
	const username = userInfo?.username;
	const profileImage = userInfo?.profilePicture;

	// Fetch number of payments from redux store
	const noOfpayments = userInfo?.payments?.length;

	const dispatch = useDispatch();

	// Fetch user payments from redux store
	const { data: userPayments, isLoading } = useUserPaymentsQuery({
		_id: userInfo?._id,
	});

	// Use useEffect to set payments after component mounts
	useEffect(() => {
		if (userPayments) {
			dispatch(setPayments(userPayments));
		}
	}, [dispatch, userPayments]);


	// Manage modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	// Display loading indicator while data is being fetched
	if (isLoading) {
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
			<div>
				<div className="p-3 pl-6 flex flex-col">
					<span className="font-semibold text-black text-lg">
						{name}
					</span>
					<span>
						{noOfpayments} {noOfpayments === 1 ? "payment" : "payments"}
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
					<button
						onClick={handleModal}
						className="border-2 rounded-2xl border-gray-700 p-1 px-3 hover:text-white hover:bg-primary hover:border-none"
					>
						Edit Profile
					</button>
				</div>
				<div className="px-3 pt-3 border-b-2 pl-6 text-primary">
					<span className="border-b-4 border-primary">payments</span>
				</div>
				<div>
					{userPayments && userPayments?.length === 0 ? ( // Check if userPayments is defined and has no payments
						<div className="text-center mt-28 p-4 text-gray-500">
							No payments to display.
						</div>
					) : (
						userPayments?.map(
							(
								payment // Use payment._id as the key
							) => (
								<RecentPayments
									key={payment._id}
									name={name}
									username={username}
									createdAt={payment.createdAt}
									image={Wrapper}
									paymentId={payment._id}
                                    amount={payment.amount}
                                    reference={payment.reference}
									u_id={userInfo._id}
								/>
							)
						)
					)}
				</div>
			</div>
			<AnnouncementContainer />
		</motion.div>
	);
};
export default PaymentHistory;