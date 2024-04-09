import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { FaEnvelope, FaMoneyBillWave } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { PaymentSVG } from "../assets";
import { useCreatePaymentMutation } from "../redux";

const PaymentForm = () => {
  
  const { userInfo } = useSelector((state) => state.auth);
  const { id } = useParams();
  const { category } = useSelector((state) => state.auth); // Access category from the Redux store
  const selectedCategory = category?.find((cat) => cat._id === id);
  const initialMatricNumber = userInfo?.matricNumber || "";
  const initialEmail = userInfo?.email || "";
  const initialCategory = selectedCategory?.name || "";
  const initialSession = selectedCategory?.session || "";
  const initialAmount = selectedCategory?.amount || "";
  

  const validationSchema = Yup.object({
    matricNumber: Yup.string()
      .matches(/^20\d{2}\/1\/\d{5}PM$/, "Invalid Matriculation Number, please use the format 20XX/1/XXXXXPM")
      .required("Matriculation Number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    category: Yup.string().required("Category is required"),
    session: Yup.string().required("Session is required"),
  });
  const [createPayment ]= useCreatePaymentMutation(); // Use the mutation hook here
  // Formik configuration
  const formik = useFormik({
    initialValues: {
      matricNumber: initialMatricNumber,
      email: initialEmail,
      category: initialCategory,
      session: initialSession,
      amount: initialAmount,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const paymentData = {
          matricNumber: values.matricNumber, // Match field names with the model
          email: values.email,
          category: values.category, // Match field names with the model
          session: values.session, // Match field names with the model
          amount: parseFloat(values.amount), // Convert amount to a number
        };

        // Make a POST request to your Express server to initiate payment
        const response = await createPayment(paymentData);   
       
        // Check if the response contains the payment URL
        if (response.data.success) {
          const { payment_url, reference, message } = response.data;

          toast.success(message);

          // Redirect to the payment URL returned by the server
          // Open the Paystack payment page in a popup window

          const popup = window.open(
            payment_url,
            "_blank",
            "width=800, height=600"
          );

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
          console.error(
            "Payment initiation failed. Missing payment_url in response."
          );
          toast.error("Payment initiation failed. Please try again.");
        }
      } catch (error) {
        const msg = error?.error?.response?.data?.message;
        toast.error(msg || "Payment initiation failed. Please try again.");
      }
    },
  });

  // Function to show a toast message with the transaction reference
  const showTransactionReference = (reference) => {
    toast.success(`Transaction Reference: ${reference}. A payment receipt will be sent to your registered mailbox upon successful payment.`, {
      position: "top-right",
      autoClose: 20000, // Close after 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const navigate = useNavigate();

  const handleEditClick = () => {
    // Navigate to the edit profile page or wherever users can edit their details.
    navigate('/profile');
    };

  return (
    <div className="flex md:flex-row flex-col bg-primary h-screen">
      <div className="md:h-full h-[20%] flex items-center justify-center">
        <img  src={PaymentSVG} className="h-full" alt="" />
      </div>


      <div className="w-full md:w-[60%] rounded-l-[10%] p-10 md:p-16 md:pl-36 bg-white flex flex-col justify-center md:ml-auto">
        <h1 className="font-bold text-2xl text-center p-10">
          Payment Form
        </h1>
        <p className="font-medium text-lg text-center">
          Please confirm your details. If any field is incorrect,{' '}
          <button
            className="text-blue-500 underline cursor-pointer"
            onClick={handleEditClick}
          >
            click here
          </button>
          &nbsp;to go to the edit profile page.
        </p>
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <label className="mt-2" htmlFor="matricNumber">
            Matriculation Number
          </label>
          <div className="flex flex-row relative w-full">
            <input
              type="text"
              name="matricNumber"
              id="matricNumber"
              onChange={formik.handleChange}
              value={formik.values.matricNumber}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10"
              disabled
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.matricNumber &&
          formik.errors.matricNumber ? (
            <div className="text-red-500">
              {formik.errors.matricNumber}
            </div>
          ) : null}

          <label className="mt-2" htmlFor="email">
            E-mail
          </label>
          <div className="flex flex-row relative w-full">
            <input
              type="text"
              name="email"
              id="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10"
              disabled
            />
            <FaEnvelope className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500">
              {formik.errors.email}
            </div>
          ) : null}

          <label className="mt-2" htmlFor="category">
            Category
          </label>
          <div className="flex flex-row relative w-full">
            <input
              type="text"
              name="category"
              id="category"
              onChange={formik.handleChange}
              value={formik.values.category}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10"
              disabled
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.category && formik.errors.category ? (
            <div className="text-red-500">
              {formik.errors.category}
            </div>
          ) : null}

          <label className="mt-2" htmlFor="session">
            Session
          </label>
          <div className="flex flex-row relative w-full">
            <input
              type="text"
              name="session"
              id="session"
              onChange={formik.handleChange}
              value={formik.values.session}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10"
              disabled
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.session && formik.errors.session ? (
            <div className="text-red-500">
              {formik.errors.session}
            </div>
          ) : null}

          <label className="mt-2" htmlFor="amount">
            Payment Amount (in Naira)
          </label>
          <div className="flex flex-row relative w-full">
            <input
              type="number"
              name="amount"
              id="amount"
              onChange={formik.handleChange}
              value={formik.values.amount}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10"
              disabled
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>

          <button
            type="submit"
            className="bg-black p-2 w-full text-white rounded-lg hover:bg-slate-700 my-5"
          >
            Pay with Paystack
          </button>
        </form>
      </div>
      <ToastContainer /> {/* Toast messages container */}
    </div>
  );
};

export default PaymentForm;
