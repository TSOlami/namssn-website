import { useFormik } from "formik";
import * as Yup from "yup";
import { FaMoneyBillWave } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FormErrors, Loader } from "../../components";
// import { Wrapper } from "../../assets";
// import { Loader } from "../Loader";
import { useCreateAdminPaymentMutation, setCredentials } from "../../redux";


const AddPaymentForm = ({ handleModalOpen }) => {
  // Get user info from redux store
  // const { userInfo } = useSelector((state) => state.auth);

  // Setup Dispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createPayment, { isLoading }] = useCreateAdminPaymentMutation();

  // Formik and yup validation schema
  const initialValues = {
    userType: '',
    category: '',
    session: '',
    amount: '',
    
    };

    const validationSchema = Yup.object({
        category: Yup.string().required('Category is required'),
        session: Yup.string()
          .matches(/^(19|20)\d{2}$/, 'Session must be a valid year (e.g., 2007)')
          .required('Session is required'),
        amount: Yup.number()
          .typeError('Price must be a number')
          .positive('Price must be a positive number')
          .required('Price is required'),
        // transactionReference: Yup.string(),
    });
  
 
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values);
        const res = await createPayment(values).unwrap();
        console.log(res);
        dispatch(setCredentials({ ...res }));
        navigate("/admin/payment");
        toast.success("Payment created successfully");
      } catch (err) {
        console.error("Failed to create payment:", err);
        toast.error(err?.data?.message || err?.error)
      }
    },
  });

  return (
    <div className="flex flex-row md:bg-primary h-screen">
      <div className="w-full md:w-[60%] rounded-l-[10%] p-10 md:p-16 md:pl-36 bg-white flex flex-col justify-center">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <div className="text-2xl font-bold">Create Payment</div>
            <div
              className="text-3xl cursor-pointer p-2"
              onClick={handleModalOpen}
            >
              <FaMoneyBillWave />
            </div>
        </div>
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <input type="hidden" name="userType" value="admin" />
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
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.category && formik.errors.category ? (
            <FormErrors error={formik.errors.text} />
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
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.session && formik.errors.session ? (
             <FormErrors error={formik.errors.text} />
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
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>
          {formik.touched.amount && formik.errors.amount ? (
             <FormErrors error={formik.errors.text} />
          ) : null}
            {isLoading && <Loader />}
          <button
            type="submit"
            className="bg-black p-2 w-full text-white rounded-lg hover:bg-slate-700 my-5"
          >
           Add Payment
          </button>
        </form>
      </div>
      <ToastContainer /> {/* Toast messages container */}
    </div>
  );
};

export default AddPaymentForm;
