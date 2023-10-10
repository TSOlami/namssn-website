import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FaEnvelope, FaMoneyBillWave } from "react-icons/fa6";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const PaymentForm = () => {
  const [amount, setAmount] = useState(""); // State to store the payment amount

  // Initial form values and validation schema
  const initialValues = {
    matricNo: "",
    email: "",
  };

  const validationSchema = Yup.object({
    matricNo: Yup.string()
      .matches(/^[0-9]{5}[A-Za-z]{2}$/, 'Invalid Matriculation Number')
      .required('Matriculation Number is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const paymentData = {
          matricNo: values.matricNo,
          email: values.email,
          amount: parseFloat(amount), // Convert amount to a number
        };

        // Make a POST request to your Express server to initiate payment
        const response = await axios.post('/api/v1/users/payment', paymentData);

                // Check if the response contains the payment URL
        if (response.data.success) { 
          const { payment_url, reference, message } = response.data;

          toast.success(message)
                    // Redirect to the payment URL returned by the server
          window.location.href = payment_url;
          
          
          // After the payment is successful, show the transaction reference
          showTransactionReference(reference);
        } else {
          console.error('Payment initiation failed. Missing payment_url in response.');
          toast.error('Payment initiation failed. Please try again.');
        }

      } catch (error) {
        console.error('Error initiating payment:', error);
        toast.error('Payment initiation failed. Please try again.');
      }
      
    },
  });

  // Function to show a toast message with the transaction reference
  const showTransactionReference = (reference) => {
    console.log("Transaction Reference:", reference); // Add this line for debugging
    toast.success(`Transaction Reference: ${reference}`, {
      position: 'top-right',
      autoClose: 20000, // Close after 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="flex flex-row md:bg-primary h-screen">
      <div className="w-full md:w-[60%] rounded-l-[10%] p-10 md:p-16 md:pl-36 bg-white flex flex-col justify-center">
        <h1 className="font-bold text-2xl text-center p-10">
          Payment Form
        </h1>
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <label className="mt-2" htmlFor="matricNo">Matriculation Number</label>
          <div className="flex flex-row relative w-full">
            <input
              type="text"
              name="matricNo"
              id="matricNo"
              onChange={formik.handleChange}
              value={formik.values.matricNo}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10"
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.matricNo && formik.errors.matricNo ? (
            <div className="text-red-500">{formik.errors.matricNo}</div>
          ) : null}

          <label className="mt-2" htmlFor="email">E-mail</label>
          <div className="flex flex-row relative w-full">
            <input
              type="text"
              name="email"
              id="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10"
            />
            <FaEnvelope className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500">{formik.errors.email}</div>
          ) : null}

          <label className="mt-2" htmlFor="amount">Payment Amount (in Naira)</label>
          <div className="flex flex-row relative w-full">
            <input
              type="number"
              name="amount"
              id="amount"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10"
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>

          <button type="submit" className="bg-black p-2 w-full text-white rounded-lg hover:bg-slate-700 my-5">Pay with Paystack</button>
        </form>
      </div>
      <ToastContainer /> {/* Toast messages container */}
    </div>
  );
};

export default PaymentForm;
