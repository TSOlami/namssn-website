import { FaXmark } from "react-icons/fa6";
import { useFormik } from "formik";
import * as Yup from "yup";

import { FormErrors } from "../../components";

const VerifyAccountForm = ({handleVerifyModal}) => {

    const initialValues = {
      studentEmail: "",
    };

    const validationSchema = Yup.object({
      studentEmail: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@st\.futminna\.edu\.ng$/,
          "Invalid email format. Your student email in the format name+studentID@st.futminna.edu.ng"
        )
        .required("Student Email is required"),
    });

    const formik = useFormik({
      initialValues,
      validationSchema,
      onSubmit: async (values) => {
        try {
          console.log(values);
        } catch (error) {
          console.log(error);
        }
      }
    });
  return (
  <div className="bg-white rounded-2xl p-4 w-96">
      <div className="flex flex-row justify-between items-center">
        <span className="font-semibold text-lg">Verify Your Profile</span>
        <button onClick={handleVerifyModal} className="text-xl text-gray-700 hover:bg-black hover:text-white p-2 rounded-md">
          <FaXmark />
        </button>
      </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2 mx-2 mt-4">
        <div>
          <label htmlFor="studentEmail">Student Email</label>
          <input
            type="email"
            name="studentEmail"
            id="studentEmail"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.studentEmail}
            className="border-2 rounded-lg border-gray-700 p-2 w-full"
            placeholder="Enter Your Student Email"
            autoComplete="email"
          />
          {formik.touched.studentEmail &&
          formik.errors.studentEmail ? (
            <FormErrors error={formik.errors.studentEmail} />
          ) : null}
        </div>
        <div>
          {/* {isLoading && <Loader />} */}

          <button 
          type='submit'
          className="bg-primary text-white rounded-lg p-2 mt-2 w-full">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default VerifyAccountForm