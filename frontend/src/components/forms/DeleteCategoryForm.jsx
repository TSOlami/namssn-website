import { useFormik } from "formik";
import * as Yup from "yup";
import { FaTrash, FaMoneyBillWave } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
// import { useDispatch } from "react-redux";
import { FormErrors, Loader } from "..";
import { useDeleteCategoryMutation } from "../../redux";

const DeleteCategoryForm = ({ handleModalOpen }) => {
  // const dispatch = useDispatch();
 

  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

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
      const res = await deleteCategory(values);
    
      if (res.status === 200) {
        // The category was successfully deleted
        toast.success(res.data.message);
      } else if (res.status === 404) {
        // The category was not found
        toast.error(res.data.message);
      } else {
        // Handle other server errors
        toast.error(res?.data?.message || "An error occurred while deleting the category.");
      }
    } catch (err) {
      // Handle errors during the request
      toast.error("An error occurred while deleting the category.");
      console.error("Failed to delete payment category:", err);
    }
    
  }
  
  });

  const closeForm = () => {
    handleModalOpen();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-center items-center">
      <div className="text-2xl font-bold">Delete Payment Category</div>
      <div className="text-3xl cursor-pointer p-2" onClick={closeForm}>
        <FaTrash />
      </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col">
            <label className="mt-2" htmlFor="category">
            Category
          </label>
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
          {formik.touched.name && formik.errors.name ? (
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
          Delete Payment Category
          </button>
          <button type='button'
          onClick={closeForm}
          className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
        >
          Close
        </button>
        </form>
      <ToastContainer />
    </div>
  );
}

export default DeleteCategoryForm;
   
