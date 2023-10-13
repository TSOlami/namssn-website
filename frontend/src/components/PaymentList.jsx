import { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderComponent from "../components/HeaderComponent";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Make an API request to retrieve the user's payments
    axios.get('/api/v1/users/payments') // Replace with your API endpoint
      .then((response) => {
        setPayments(response.data);
        })
      .catch((error) => {
        console.error('Error fetching payments:', error);
      });
  }, [payments]); // Remove "payments" from the dependency array

  return (
    <div className="flex flex-row">
      {/* <Sidebar /> */}
  
      <div className="w-full h-full">
        <HeaderComponent title="Payments" />
  
        <div className="flex flex-row w-full h-full">
          <div className="h-full w-[500px]">
            <h1 className="px-4 py-2 text-2xl  font-semibold text-gray-700">
              Payments to be Made
            </h1>
            <ul>
              {payments.map((payment) => (
                <li
                  key={payment._id}
                  className="shadow-3xl flex flex-row justify-between items-center rounded-2xl m-8 p-4 gap-20 pr-14"
                >
                  <div className="flex flex-col">
                    <p>
                      Category: {payment.category}
                    </p>
                    <p>
                      Session: {payment.session}
                    </p>
                    <div className="py-4 flex flex-row items-center gap-2">
                      Amount :{" "}
                      <span className="text-xl font-semibold">
                        #{payment.amount}
                      </span>
                    </div>
                  </div>
                  <div className="border-gray-500 border-2 rounded-xl flex flex-row p-2 text-xl font-semibold">
                     Pay Now
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default PaymentList;
