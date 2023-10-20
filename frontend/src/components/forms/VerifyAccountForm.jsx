import { useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { FormErrors } from "../../components";
import { accountVerificationOTP } from "../../utils";

const VerifyAccountForm = ({handleVerifyModal}) => {
  // Use the useNavigate hook to navigate to the next page
  const navigate = useNavigate();

  // Use the useSelector hook to access the userInfo object from the state
  const { userInfo } = useSelector((state) => state.auth);

  const username = userInfo?.username;

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
        // Get the student email from the form values
        const { studentEmail } = values;
        // Generate the OTP and send it to the student's email
        const OTPResponse = await accountVerificationOTP(username, studentEmail); // Assuming 'username' is available
    
        if (OTPResponse.code) {
          // OTP generated successfully, you can now send it to the user or display a success message
          console.log(`OTP generated successfully: ${OTPResponse.code}`);
          toast.success("OTP has been sent to your email.");
          // Navigate to the /verify-email page
          navigate("/verify-email");
        } else {
          // Handle any error or failed OTP generation here
          console.error("Failed to generate OTP");
          toast.error("Failed to generate OTP. Please try again.");
        }
      } catch (error) {
        // Handle any unexpected errors here
        console.error("An error occurred:", error);
        toast.error("An error occurred while generating OTP. Please try again.");
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
            placeholder="Enter Your FUTMINNA Student Email"
            autoComplete="email"
          />
          {formik.touched.studentEmail &&
          formik.errors.studentEmail ? (
            <FormErrors error={formik.errors.studentEmail} />
          ) : null}
        </div>
        <div>
          <button 
          type='submit'
          className="bg-primary text-white rounded-lg p-2 mt-2 w-full">
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default VerifyAccountForm