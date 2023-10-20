import { useAllPaymentsQuery } from '../redux'; // Import Redux Toolkit Query hook and action creator
import { Link } from 'react-router-dom'

import {HeaderComponent} from '../components';

const PaymentList = () => {
  // Use the useAllPaymentsQuery hook to fetch payments
  const { data: payments, isLoading, isError } = useAllPaymentsQuery();

  return (
    <div className="flex flex-row">
      {/* <Sidebar /> */}
      <div className="w-full h-full">
  <HeaderComponent title="Payments" />
  <div className="flex flex-row w-full h-full">
    <div className="h-full w-[500px]">
      <h1 className="px-4 py-2 text-2xl font-semibold text-gray-700">
        Payments to be Made
      </h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading payments</p>
      ) : !payments || !Array.isArray(payments) || payments.length === 0 ? (
        <p>No payments to be made at the moment.</p>
      ) : (
        <ul>
          {payments.map((payment) => (
            <li
              key={payment._id}
              className="shadow-3xl flex flex-row w-[500px] justify-between items-center rounded-2xl m-8 p-4 gap-20 pr-14"
            >
              <div className="flex flex-col">
                <p>Category: {payment.name}</p>
                <p>Session: {payment.session}</p>
                <div className="py-4 flex flex-row items-center gap-2">
                  Amount :{' '}
                  <span className="text-xl font-semibold">
                    #{payment.amount}
                  </span>
                </div>
              </div>
              <div className="border-gray-500 border-2 rounded-xl flex flex-row p-2 text-xl font-semibold">
                <Link
                  to={`/payments/pay/${payment._id}?name=${payment.name}&amount=${payment.amount}&session=${payment.session}`}
                >
                  Pay Now
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
        </div>

    </div>
  );
};

export default PaymentList;
