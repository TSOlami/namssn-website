import { useState } from "react";
import { Sidebar,  AddCategoryForm, DeleteCategoryForm, HeaderComponent, PaymentDetails } from "../components";
import { mockPaidUsers } from "../data";
import { useAllPaymentsQuery, useVerifyPaymentsMutation} from '../redux'; // 
import { motion } from "framer-motion";

const AdminPayment = () => {
  const { data: payments, isLoading, isError } = useAllPaymentsQuery();
  const { data: verifiedPayments } = useVerifyPaymentsMutation();
  console.log(verifiedPayments)
  
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
 
  
	return (
		<motion.div 			
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
     className="flex flex-row">
			<Sidebar />

			<div className="w-full h-full">
				<HeaderComponent title="Payments" />

				<div className="flex flex-row w-full h-full ">
          <div className="h-full w-[500px] ">
              {isLoading ? (
                <p>Loading payments...</p>
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


            {/* Payment details table */}

            <HeaderComponent title="Payment Details" url={"placeholder"}/>

            <div>
              <table>
                <thead>
                  <tr className="">
                    <th className="px-2 mx-7 md:px-4 py-2 text-left font-semibold text-gray-700">
                      No
                    </th>
                    <th className="px-2 mx-7 md:px-4 py-2 text-left font-semibold text-gray-700">
                      Full Name
                    </th>
                    <th className="px-2 mx-7 md:px-4 py-2 text-left font-semibold text-gray-700">
                      Matric NO
                    </th>
                    <th className="px-2 mx-7 md:px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPaidUsers.map((user, index) => (
                    <tr key={index} className="">
                      <td className="px-2 mx-7 md:px-4 py-2 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-2 mx-7 md:px-4 py-2 whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-2 mx-7 md:px-4 py-2 whitespace-nowrap">
                        {user.matric}
                      </td>
                      <td >
                        <div className="px-2 md:px-4 py-1 whitespace-nowrap bg-black text-white rounded-md m-1">
                        {user.status}

                        </div>
                      </td>
                    </tr>
                  ))
                  }
                </tbody>
              </table>
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