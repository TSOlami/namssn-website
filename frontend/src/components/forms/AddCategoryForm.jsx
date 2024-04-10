import { useFormik } from "formik";
import * as Yup from "yup";
import { FaMoneyBillWave, FaXmark } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FormErrors, Loader } from "..";
import { useCreateCategoryMutation } from "../../redux";


const AddCategoryForm = ({ handleModal }) => {
 
// Setup Dispatch
const navigate = useNavigate();

const [createCategory, { isLoading }] = useCreateCategoryMutation();

// Formik and yup validation schema
const initialValues = {
  name: '',
  session: '',
  amount: '',
  
  };

  const validationSchema = Yup.object({
      name: Yup.string().required('Name is required'),
      session: Yup.string()
        .matches(/^(19|20)\d{2}$/, 'Session must be a valid year (e.g., 2007)')
        .required('Session is required'),
      amount: Yup.number()
        .typeError('Price must be a number')
        .positive('Price must be a positive number')
        .required('Price is required'),
  });


const formik = useFormik({
  initialValues: initialValues,
  validationSchema: validationSchema,
  onSubmit: async (values) => {
    try {
      await toast.promise(
        createCategory(values).unwrap(),
        {
          pending: "Creating Payment Category...",
          success: "Payment Category created successfully",
        }
      );
      handleModal();
      navigate("/admin/payment");
    } catch (err) {
      toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
    }
  },
});

if (isLoading) {
  return <Loader />; // Render the Loader while data is being fetched
}
  
return (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-center items-center">
    <div className="bg-white p-5 w-[400px] rounded-3xl">
      <div className="flex flex-row justify-between items-center">
      <div className="rounded w-fit p-2 hover:text-white hover:bg-black place-self-end">
      <span className="font-semibold text-lg">Add Payment Category</span>
        <FaMoneyBillWave />
      </div>
      <button onClick={handleModal} className="text-xl text-gray-700 hover:bg-black hover:text-white p-2 rounded-md">
        <FaXmark />
      </button>
    </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col">
        <label htmlFor="category" className="pt-2 font-bold text-xl">Create Payment Category</label>
        <div className="pt-3">
          <label htmlFor="name" className="text-lg">Category</label>
          <div className="flex flex-row relative w-full">
            <input
              type="text"
              name="name"
              id="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10"
            />
            <FaMoneyBillWave className="absolute left-2 flex self-center justify-center" />
          </div>
        </div>
        {formik.touched.name && formik.errors.name ? (
          <FormErrors error={formik.errors.name} />
        ) : null}

        <div className="pt-3">
          <label htmlFor="session" className="text-lg">Session</label>
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
        </div>
        {formik.touched.session && formik.errors.session ? (
          <FormErrors error={formik.errors.session} />
        ) : null}

        <div className="pt-3">
          <label htmlFor="amount" className="text-lg">Payment Amount (in Naira)</label>
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
        </div>
        {formik.touched.amount && formik.errors.amount ? (
          <FormErrors error={formik.errors.amount} />
        ) : null}
        <button
          type="submit"
          className="bg-black p-2 w-full text-white rounded-lg hover:bg-slate-700 my-5"
        >
          Add Payment Category
        </button>
      </form>
      <ToastContainer /> {/* Toast messages container */}
    </div>
  </div>

  );  
};

export default AddCategoryForm;
