import { useState, useEffect } from "react";
import { Sidebar, AddCategoryForm, DeleteCategoryForm, HeaderComponent, PaymentDetails, RecentPayments, PaymentVerificationForm } from "../components";
import { FaCheck } from "react-icons/fa6";
import { useAllPaymentsQuery, useVerifyPaymentsMutation, useGetAllPaymentsQuery, setPayments } from '../redux';
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { PaymentListSkeleton } from "../components/skeletons";

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

	return (
		<motion.div 			
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
     className="flex flex-row">
			<Sidebar />

			<div className="w-full h-full">
				<HeaderComponent title="Payments" back/>

				<div className="flex flex-row w-full h-full ">
          <div className="h-full w-[500px] ">
              {isLoading ? (
                <p className="p-2">Loading payments... <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mx-2" /></p>
              ) : isError ? (
                <p>Error loading payments</p>
              ) : !payments || !Array.isArray(payments) || payments.length === 0 ? (
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
                className="m-5 my-10 p-3 bg-primary text-white rounded-sm"
                onClick={handleModal}
              >
                Add New Payment
              </button>
            
            </div>
					
					</div>             
          
					{/* Payment details and breakdown section */}
					<div className="border-r-gray-300 border-l-2 h-full">

            {/* Payment details card */}
						<div className="shadow-3xl flex flex-row w-[500px] justify-between items-center rounded-2xl m-8 p-4 gap-20 pr-14">
							<div className="flex flex-col">
								<p>
									Let&apos;s help NAMSSN grow by paying our
									departmental dues. Ensure you use your
									matric number as description for the
									transfer.{" "}
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
						</div>


            {/* Delete and Edit payment button */}
            <div className="p-5 py-10 ">
              <button className="bg-red-600 text-white p-2 rounded-md" onClick={handleVerifyModal} >Delete Payment</button>
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

            {/* Payment details table */}

            <HeaderComponent title="Recent Payment Details" url={"placeholder"}/>
            <div>
					{Loading ? (
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