import { useState } from "react";
import { Sidebar,  AddPaymentForm, EditPaymentForm, DeletePaymentForm } from "../components";
import HeaderComponent from "../components/HeaderComponent";
import PaymentDetails from "../components/PaymentDetails";
import { mockPaidUsers, mockPayments } from "../data";

const AdminPayment = () => {
    const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
    const [showEditPaymentForm, setShowEditPaymentForm] = useState(false);
    const [showDeletePaymentForm, setShowDeletePaymentForm] = useState(false);
  
    const openAddPaymentForm = () => {
      setShowAddPaymentForm(true);
      setShowEditPaymentForm(false);
      setShowDeletePaymentForm(false);
    };
  
    const openEditPaymentForm = () => {
      setShowAddPaymentForm(false);
      setShowEditPaymentForm(true);
      setShowDeletePaymentForm(false);
    };
  
    const openDeletePaymentForm = () => {
      setShowAddPaymentForm(false);
      setShowEditPaymentForm(false);
      setShowDeletePaymentForm(true);
    };
  
  
	return (
		<div className="flex flex-row">
			<Sidebar />

			<div className="w-full h-full">
				<HeaderComponent title="Payments" />

				<div className="flex flex-row w-full h-full ">
					<div className="h-full w-[500px] ">
						{mockPayments.map((payment, index) => (
							<PaymentDetails
								key={index}
								title={payment.title}
								amount={payment.amount}
							/>
						))}

						<button className="m-5 my-10 p-3 bg-primary text-white rounded-sm" onClick={openAddPaymentForm} >
            Add New Payment
						</button>
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
              <button className="border-gray-300 border-2 text-black p-2 rounded-md mr-5" onClick={openEditPaymentForm}>Edit Payment</button>
              <button className="bg-red-600 text-white p-2 rounded-md" onClick={openDeletePaymentForm} >Delete Payment</button>
            </div>


            {/* Payment details table */}

            <HeaderComponent title="Payment Details" />

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
                      <td className="px-2 mx-7 md:px-4 py-2 whitespace-nowrap bg-black text-white m-1">
                        {user.status}
                      </td>
                    </tr>
                  ))
                  }
                </tbody>
              </table>
            </div>
					</div>
				</div>
			</div>
      {showAddPaymentForm && <AddPaymentForm />}
      {showEditPaymentForm && <EditPaymentForm />}
      {showDeletePaymentForm && <DeletePaymentForm />}
		</div>
	);
};

export default AdminPayment;
