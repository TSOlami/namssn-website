import { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Make an API request to retrieve the user's payments
    axios.get('/api/v1/users/payments') // Replace with your API endpoint
      .then((response) => {
        setPayments(response.data);
        console.log(payments);
      })
      .catch((error) => {
        console.error('Error fetching payments:', error);
      });
  }, []); // Remove "payments" from the dependency array

  return (
    <div>
      <h1>Payments to be Made</h1>
      <ul>
        {payments.map((payment) => (
          <li key={payment._id}>
            Category: {payment.category}
            Session: {payment.session}
            Amount: {payment.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentList;
