import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { FaMoneyBillWave } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components";
import { useDeleteCategoryMutation, setCredentials } from "../../redux";


const DeletePaymentForm = ({ handleModalOpen, paymentData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deletePayment, { isLoading }] = useDeleteCategoryMutation();
  
    const formik = useFormik({
      initialValues: {},
      onSubmit: async () => {
        try {
          const res = await deletePayment(paymentData.id).unwrap();
          dispatch(setCredentials({ ...res }));
          navigate("/admin/payment");
          toast.success("Payment deleted successfully");
        } catch (err) {
          console.error("Failed to delete payment:", err);
          toast.error(err?.data?.message || err?.error);
        }
      },
    });
  
    return (
      <div className="flex flex-row md:bg-primary h-screen">
        <div className="w-full md:w-[60%] rounded-l-[10%] p-10 md:p-16 md:pl-36 bg-white flex flex-col justify-center">
          <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <div className="text-2xl font-bold">Delete Payment</div>
            <div
              className="text-3xl cursor-pointer p-2"
              onClick={handleModalOpen}
            >
              <FaMoneyBillWave />
            </div>
          </div>
          <form onSubmit={formik.handleSubmit} className="flex flex-col">
            <p>Are you sure you want to delete this payment?</p>
            {isLoading && <Loader />}
            <button
              type="submit"
              className="bg-red p-2 w-full text-white rounded-lg hover:bg-red-700 my-5"
            >
              Delete Payment
            </button>
          </form>
        </div>
        <ToastContainer /> {/* Toast messages container */}
      </div>
    );
  };
  
  export default DeletePaymentForm;
  