import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { verifyOTP } from "../../utils";
import { useVerifyAccountMutation, useSendMailMutation, setCredentials } from "../../redux";
import { Loader } from "../../components";

const VerificationAccountInput = ({ codeLength }) => {
  // Use the useSelector hook to access the userInfo object from the state
  const { userInfo } = useSelector((state) => state.auth);

  const username = userInfo?.username || "";

  // Get the student email from the URL params
  const { studentEmail } = useParams();

  // Dispatch actions using the useDispatch hook
  const dispatch = useDispatch();

  const navigate = useNavigate()
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (value.length === 1 && /^[0-9]$/.test(value)) {
      // Move focus to the next input field
      if (index < codeLength - 1) {
        inputRefs[index + 1].current.focus();
      }

      // Update the verification code
      const updatedCode = [...verificationCode];
      updatedCode[index] = value;
      setVerificationCode(updatedCode);
    } else if (value.length === 0) {
      // Allow backspacing to previous input field
      if (index > 0) {
        inputRefs[index - 1].current.focus();
      }

      // Clear the current input field
      const updatedCode = [...verificationCode];
      updatedCode[index] = "";
      setVerificationCode(updatedCode);
    }
  };

  // Use the useVerifyAccountMutation hook to verify the user's account
  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();

  // Use the useSendMailMutation hook send a congratulatory email to the user
  const [sendMail] = useSendMailMutation();

  const code = verificationCode.join("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let { status, data } = await verifyOTP(username, code);

      if (status === 200) {
        // Call verifyAccount to verify the user's account
        const verifyAccountResponse = await verifyAccount({ username, studentEmail }).unwrap();

        if (verifyAccountResponse.error) {
          // Handle any error from account verification
          console.error("Failed to verify account");
          toast.error("Failed to verify the account. Please try again.");
        } else {
          // Update the user's credentials in the state
          dispatch(setCredentials({ ...verifyAccountResponse }));
          // Send a congratulatory email to the user
          const text = `Congratulations ${username}! Your account has been verified. You are now an official member of our community. Enjoy the benefits and stay connected!`;
          const subject = "Account Verification Successful";
          const sendMailResponse = await sendMail({ username, userEmail: studentEmail, text, subject }).unwrap();

          if (sendMailResponse.error) {
            // Handle any error from sending the congratulatory email
            console.error("Failed to send congratulatory email");
            toast.error("Account verification successful but failed to send congratulatory email.");
          }
          // Account verification and OTP verification were both successful
          navigate("/profile");
          toast.success("Account verification successful.");
        }
      } else {
        // Handle any error or failed OTP verification here
        console.error("Failed to verify OTP");
        if (data && data.message) {
          toast.error(data.message); // Display the error message from the server
        } else {
          toast.error("Failed to verify OTP. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      if (error.error.response && error.error.response.data && error.error.response.data.message) {
        toast.error(error.error.response.data.message); // Display the error message from Axios response
      } else {
        toast.error("An error occurred during OTP verification. Please try again.");
      }
    }
  };

  return (
    <div>
      {/* Check index.css for styling */}
      <div className="verification-code-input pt-5">
        {verificationCode.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleInputChange(e, index)}
            ref={inputRefs[index]}
          />
        ))}
      </div>

      <button
        className={
          code.length < 6
            ? "p-3 px-4 rounded-md bg-primary text-white shadow-lg flex m-auto my-5 opacity-50 cursor-not-allowed"
            : "p-3 px-4 rounded-md bg-primary text-white shadow-lg flex m-auto my-5"
        }
        onClick={handleSubmit}
      >
        Enter and Continue
      </button>
      {isLoading && <Loader />}
    </div>
  );
};

export default VerificationAccountInput;
