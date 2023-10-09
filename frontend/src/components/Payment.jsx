import  { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FaEnvelope, FaMoneyBillWave } from "react-icons/fa";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentForm = () => {
  const [amount, setAmount] = useState(""); // State to store the payment amount
  const [paymentReference, setPaymentReference] = useState(""); // State to store the payment reference
  const [isPaymentVerified, setIsPaymentVerified] = useState(false); // State to track payment verification

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
          callbackUrl: `${window.location.origin}/paystack-callback`, // Specify the callback URL
        };

        // Make a POST request to your Express server to initiate payment
        const response = await axios.post('/api/initiatePayment', paymentData);

        // Check if the response contains the payment URL
        if (response.data.payment_url) {
          // Open the Paystack payment page in a pop-up window
          const popUpWindow = window.open(response.data.payment_url, '_blank', 'width=600,height=600');
          setPaymentReference(response.data.reference);

          // Start checking the payment status when the pop-up window is closed
          const checkStatusInterval = setInterval(() => {
            if (popUpWindow.closed) {
              clearInterval(checkStatusInterval); // Stop checking
              pollPaymentStatus(response.data.reference);
            }
          }, 1000); // Check every 1 second
        } else {
          toast.error('Server error occurred');
        }
      } catch (error) {
        toast.error('Server error occurred');
      }
    }
  });
  // Function to poll payment verification status
const pollPaymentStatus = async (reference) => {
  try {
    const verifyResponse = await axios.get(`/api/verifyPayment/${reference}`);

    if (verifyResponse.data.data.status === true) {
      // Payment has been successfully verified
      setIsPaymentVerified(true);
      setPaymentReference(reference);

      // Display a success toast message with the payment reference
      toast.success(`Payment successful. Reference: ${reference}`);

      // Reset the form to its initial values
      formik.resetForm();
      setAmount(""); // Clear the amount field
    } else {
      // Payment verification is still pending, continue polling
      setTimeout(() => {
        pollPaymentStatus(reference);
      }, 3000); // Poll every 3 seconds (adjust the interval as needed)
    }
  } catch (error) {
    // Handle errors gracefully
    console.error('Error verifying payment:', error);

    if (error.response) {
      // The request was made, but the server responded with an error status code
      console.error('Server responded with status:', error.response.status);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('No response received from the server');
    } else {
      // Something else went wrong
      console.error('An error occurred:', error.message);
    }

    // Display an error toast message
    toast.error('Error occurred during payment verification');
  }
};


  // // Function to poll payment verification status
  // const pollPaymentStatus = async (reference) => {
  //   try {
  //     const verifyResponse = await axios.get(`/api/verifyPayment/${reference}`);

  //     if (verifyResponse.data.data.status === true) {
  //       // Payment has been successfully verified
  //       setIsPaymentVerified(true);
  //       setPaymentReference(reference)

  //       // Display a success toast message with the payment reference
  //       toast.success(`Payment successful. Reference: ${verifyResponse.data.data.reference}`);
        

  //       // Reset the form to its initial values
  //       formik.resetForm();
  //       setAmount(""); // Clear the amount field
  //     } else {
  //       // Payment verification is still pending, continue polling
  //       setTimeout(() => {
  //         pollPaymentStatus(reference);
  //       }, 3000); // Poll every 3 seconds (adjust the interval as needed)
  //     }
  //   } 
  //   catch (error) {
  //     toast.error('Server error occurred during payment verification');
  //   }
  // };


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
