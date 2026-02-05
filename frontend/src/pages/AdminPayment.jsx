import { useState, useEffect } from "react";
import { Sidebar, AddCategoryForm, DeleteCategoryForm, HeaderComponent, PaymentDetails, RecentPayments, PaymentVerificationForm, ConfirmDialog } from "../components";
import { FaCheck, FaMagnifyingGlass, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useAllPaymentsQuery, useVerifyPaymentsMutation, useGetAllPaymentsQuery, setPayments } from '../redux';
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { PaymentListSkeleton } from "../components/skeletons";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEBOUNCE_MS = 300;

const AdminPayment = () => {
  const { data: payments, isLoading, isError } = useAllPaymentsQuery();
  const [verificationResult, setVerificationResult] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
	const [showDeletePaymentConfirm, setShowDeletePaymentConfirm] = useState(false);
	const handleVerifyModal = () => {
		setIsVerifyModalOpen(!isVerifyModalOpen);
	};
	const handleDeletePaymentClick = () => {
		setShowDeletePaymentConfirm(true);
	};
	const handleConfirmDeletePayment = () => {
		setShowDeletePaymentConfirm(false);
		handleVerifyModal();
	};

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(PAGE_SIZE);
	const [searchInput, setSearchInput] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	useEffect(() => {
		const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), DEBOUNCE_MS);
		return () => clearTimeout(t);
	}, [searchInput]);

  const dispatch = useDispatch();
  const { data: paymentsResponse, isLoading: Loading } = useGetAllPaymentsQuery({
    page,
    limit,
    search: debouncedSearch,
  });
  const allpayments = paymentsResponse?.data ?? [];
  const total = paymentsResponse?.total ?? 0;
  const totalPages = paymentsResponse?.totalPages ?? 1;

  const [verifyUserPayments] = useVerifyPaymentsMutation();
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

            <div className="p-5 py-10 ">
              <button className="bg-red-600 text-white p-2 rounded-md" onClick={handleDeletePaymentClick} >Delete Payment</button>
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

            <HeaderComponent title="Recent Payment Details" url={"placeholder"}/>
            <div className="mb-4 flex flex-wrap items-center gap-3">
							<div className="relative flex-1 min-w-[180px] max-w-sm">
								<FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
								<input
									type="text"
									placeholder="Search by reference, email, matric, category..."
									value={searchInput}
									onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
									className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
								/>
							</div>
							<div className="text-sm text-gray-600">
								{total} payment{total !== 1 ? "s" : ""} total
							</div>
						</div>
            <div>
					{Loading ? (
						<PaymentListSkeleton count={limit} />
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
						{!Loading && total > 0 && (
							<div className="flex flex-wrap items-center justify-between gap-3 mt-4">
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<span>Rows per page:</span>
									<select
										value={limit}
										onChange={(e) => {
											setLimit(Number(e.target.value));
											setPage(1);
										}}
										className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
									>
										{PAGE_SIZE_OPTIONS.map((size) => (
											<option key={size} value={size}>
												{size}
											</option>
										))}
									</select>
								</div>
								<p className="text-sm text-gray-600">
									Page {page} of {totalPages}
								</p>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page <= 1}
										className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
									>
										<FaChevronLeft className="text-gray-600" />
									</button>
									<button
										type="button"
										onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
										disabled={page >= totalPages}
										className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
									>
										<FaChevronRight className="text-gray-600" />
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
        {/* modal */}
			{isModalOpen && (
				<div className="fixed inset-0 z-[10000] bg-black/50 flex justify-center items-center">
					<AddCategoryForm handleModal={handleModal} />
				</div>
			)}

			{isVerifyModalOpen && (
				<div className="fixed inset-0 z-[10000] bg-black/50 flex justify-center items-center">
					<DeleteCategoryForm handleVerifyModal={handleVerifyModal} />
				</div>
			)}

			<ConfirmDialog
				isOpen={showDeletePaymentConfirm}
				onClose={() => setShowDeletePaymentConfirm(false)}
				onConfirm={handleConfirmDeletePayment}
				title="Delete payment category?"
				message="You are about to open the form to delete a payment category. This action cannot be undone. Continue?"
				confirmLabel="Continue"
			/>
		</motion.div>
      
		
	);
};

export default AdminPayment;