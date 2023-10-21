import  { useState } from 'react';

const PaymentVerificationForm = ({ onVerify }) => {
  const [transactionReference, setTransactionReference] = useState('');

  const handleVerify = () => {
    // Perform the verification and pass the transactionReference to the onVerify callback
    onVerify(transactionReference);
  };

  return (
    <div className="payment-verification-form">
      <h2 className="text-xl font-semibold mb-3">Payment Verification</h2>
      <div className="flex flex-col space-y-3">
        <label htmlFor="transactionReference" className="text-lg">Transaction Reference</label>
        <input
          type="text"
          name="transactionReference"
          id="transactionReference"
          placeholder="Enter Transaction Reference"
          value={transactionReference}
          onChange={(e) => setTransactionReference(e.target.value)}
          className="border rounded-lg border-gray-300 px-3 py-2"
        />
      </div>
      <button
        onClick={handleVerify}
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 mt-3"
      >
        Verify Payment
      </button>
    </div>
  );
};

export default PaymentVerificationForm;
