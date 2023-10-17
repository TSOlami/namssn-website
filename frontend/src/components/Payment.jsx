import * as Yup from "yup";
import { useFormik } from "formik";
import { useLocation } from "react-router-dom";
import { FaEnvelope, FaMoneyBillWave } from "react-icons/fa6";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector} from 'react-redux';



const PaymentForm = () => {
  // const [amount, setAmount] = useState(""); // State to store the payment amount
  const { userInfo } = useSelector((state) => state.auth);
	const email = userInfo?.email;
	const matricNumber = userInfo?.matricNumber;
	const location = useLocation("") ; // for current Location
  const searchParams = new URLSearchParams(location.search); // seacrh Params

  
  // // for initial values 
  const initialMatricNumber = matricNumber || "";
  const initialEmail = email || "";
  const initialCategory = searchParams.get('name') || "";
  const initialSession = searchParams.get('session') || "";
  const initialAmount = searchParams.get('amount') || ""

  const validationSchema = Yup.object({
    matricNumber: Yup.string()
      .matches(/^[0-9]{5}[A-Za-z]{2}$/, 'Invalid Matriculation Number')
      .required('Matriculation Number is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    category: Yup.string().required('Category is required'),
    session: Yup.string().required('Session is required'),
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      matricNumber: initialMatricNumber,
      email: initialEmail,
      category: initialCategory,
      session: initialSession,
      amount: initialAmount
      
    },
    validationSchema: validationSchema,
    onSubmit: async (values, {resetForm}) => {
      try {
        const paymentData = {
          matricNumber: values.matricNumber, // Match field names with the model
          email: values.email,
          category: values.category, // Match field names with the model
          session: values.session, // Match field names with the model
          amount: parseFloat(values.amount), // Convert amount to a number
        };

        // Make a POST request to your Express server to initiate payment
        const response = await axios.post('/api/v1/users/payments', paymentData);

        // Check if the response contains the payment URL
        if (response.data.success) {
          const { payment_url, reference, message } = response.data;

          toast.success(message);

          // Redirect to the payment URL returned by the server
          // Open the Paystack payment page in a popup window
          const popup = window.open(payment_url, '_blank', 'width=800, height=600');

          // Check if the popup window is closed
          const checkPopup = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkPopup);
              // After the payment is successful, show the transaction reference
              showTransactionReference(reference);
              // Popup window is closed, navigate back to the previous page
              window.history.back();
            }
          }, 2000); // Check every 1 second


          // After the payment is successful, show the transaction reference
          // showTransactionReference(reference);

          resetForm();
          
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
          <label className="mt-2" htmlFor="matricNumber">Matriculation Number</label>
          <div className="flex flex-row relative w-full">
            <input
              type="text"
              name="matricNumber"
              id="matricNumber"
              onChange={formik.handleChange}
              value={formik.values.matricNumber}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10" disabled
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.matricNumber && formik.errors.matricNumber ? (
            <div className="text-red-500">{formik.errors.matricNumber}</div>
          ) : null}

          <label className="mt-2" htmlFor="email">E-mail</label>
          <div className="flex flex-row relative w-full">
            <input
              type="text"
              name="email"
              id="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10" disabled
            />
            <FaEnvelope className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500">{formik.errors.email}</div>
          ) : null}

          <label className="mt-2" htmlFor="category">Category</label>
          <div className="flex flex-row relative w-full">
            <input
              type="text"
              name="category"
              id="category"
              onChange={formik.handleChange}
              value={formik.values.category}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10" disabled
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.category && formik.errors.category ? (
            <div className="text-red-500">{formik.errors.category}</div>
          ) : null}

          <label className="mt-2" htmlFor="session">Session</label>
          <div className="flex flex-row relative w-full">
            <input
              type="text"
              name="session"
              id="session"
              onChange={formik.handleChange}
              value={formik.values.session}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10" disabled
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.session && formik.errors.session ? (
            <div className="text-red-500">{formik.errors.session}</div>
          ) : null}

          <label className="mt-2" htmlFor="amount">Payment Amount (in Naira)</label>
          <div className="flex flex-row relative w-full">
            <input
              type="number"
              name="amount"
              id="amount"
              onChange={formik.handleChange}
              value={formik.values.amount}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10" disabled
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
