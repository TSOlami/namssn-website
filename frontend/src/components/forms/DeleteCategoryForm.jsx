import { useFormik } from "formik";
import * as Yup from "yup";
import { FaTrash, FaXmark} from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import { FormErrors, Loader } from "..";
import { useDeleteCategoryMutation } from "../../redux";

const DeleteCategoryForm = ({handleVerifyModal}) => {
 
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-center items-center">
      <div className="bg-white p-5 w-[400px] rounded-3xl">
      <div className="flex flex-row justify-between items-center">
        <div className="rounded w-fit p-2 hover:text-white hover:bg-black place-self-end">
        <span className="font-semibold text-lg">Add Payment Category</span>
          <FaTrash />
        </div>
        <button onClick={handleVerifyModal} className="text-xl text-gray-700 hover:bg-black hover:text-white p-2 rounded-md">
          <FaXmark />
        </button>
      </div>
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <label htmlFor="category" className="pt-2 font-bold text-xl">Delete Payment Category</label>
          <div className="pt-3">
            <label htmlFor="name" className="text-lg">Category</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full"
            />
          </div>
          {formik.touched.name && formik.errors.name ? (
            <FormErrors error={formik.errors.name} />
          ) : null}
  
          <div className="pt-3">
            <label htmlFor="session" className="text-lg">Session</label>
            <input
              type="text"
              name="session"
              id="session"
              onChange={formik.handleChange}
              value={formik.values.session}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full"
            />
          </div>
          {formik.touched.session && formik.errors.session ? (
            <FormErrors error={formik.errors.session} />
          ) : null}
  
          <div className="pt-3">
            <label htmlFor="amount" className="text-lg">Payment Amount (in Naira)</label>
            <input
              type="number"
              name="amount"
              id="amount"
              onChange={formik.handleChange}
              value={formik.values.amount}
              className="border-2 rounded border-gray-400 h-[40px] p-2 w-full"
            />
          </div>
          {formik.touched.amount && formik.errors.amount ? (
            <FormErrors error={formik.errors.amount} />
          ) : null}
          
          {isLoading && <Loader />}
  
          <button
            type="submit"
            className="bg-black text-white rounded-lg p-2 mt-5 hover:bg-slate-700"
          >
            Delete Payment Category
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
  
}

export default DeleteCategoryForm;
   
