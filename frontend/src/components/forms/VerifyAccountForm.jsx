import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { FormErrors } from "../../components";
import { accountVerificationOTP, checkStudentEmailExistence } from "../../utils";

const VerifyAccountForm = ({handleVerifyModal}) => {
  // Use the useNavigate hook to navigate to the next page
  const navigate = useNavigate();

  // Set state for the sending OTP button
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  // Use the useSelector hook to access the userInfo object from the state
  const { userInfo } = useSelector((state) => state.auth);

  // Use the useCheckStudentEmailMutation hook to check if the student email exists

  const username = userInfo?.username;

  const initialValues = {
    studentEmail: "",
  };

  const validationSchema = Yup.object({
    studentEmail: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@st\.futminna\.edu\.ng$/,
        "Invalid email format. Your student email in the format: name+studentID@st.futminna.edu.ng"
      )
      .required("Student Email is required")
      .test("email-exists", "This student email is already in use. Please use a different email.", async function (value) {
        // Use a custom test function for asynchronous validation
        try {
          const exists = await checkStudentEmailExistence(value);
          return !exists;
        } catch (error) {
          return false;
        }
      }),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Get the student email from the form values
        const { studentEmail } = values;
        // Set the sending OTP button to true
        setIsSendingOTP(true);

        // Generate the OTP and send it to the student's email
        const OTPResponse = await toast.promise(accountVerificationOTP(username, studentEmail), {
          pending: "Generating OTP...",
          success: "OTP generated successfully.",
        });
    
        if (OTPResponse.code) {
          // OTP generated successfully
          // Set the sending OTP button to false
          setIsSendingOTP(false);
          
          // Navigate to the /verify-email page
          navigate(`/verify-account/${studentEmail}`);
        } else {
          // Handle any error or failed OTP generation here
          console.error("Failed to generate OTP");
          toast.error("Failed to generate OTP. Please try again.");
          // Set the sending OTP button to false
          setIsSendingOTP(false);
        }
      } catch (err) {
        // Handle any unexpected errors here
        toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
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
          {isSendingOTP ? (
            <button
              type="button"
              disabled
              className="bg-black p-2 w-full text-white rounded-lg hover:bg-slate-700 cursor-not-allowed"
            >
              Sending OTP...
            </button>
          ) : (
            <button 
            type='submit'
            className="bg-primary text-white rounded-lg p-2 mt-2 w-full">
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default VerifyAccountForm