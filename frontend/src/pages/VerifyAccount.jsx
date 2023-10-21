import { motion } from "framer-motion";
import { VerifyEmailSVG } from "../assets";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { VerificationAccountInput } from "../components";
import { resendAccountVerificationOTP } from "../utils";

const VerifyAccount = () => {
	const { studentEmail } = useParams(); // Get the studentEmail parameter from the URL

  // Select the username from the state
  const { userInfo } = useSelector((state) => state.auth);
  const username = userInfo?.username;

  const handleResendOTP = async () => {
    // Use the resendAccountVerificationOTP function to resend OTP
    try {
      const { code, error } = await resendAccountVerificationOTP(username, studentEmail);

      if (code) {
        // OTP sent successfully
        console.log("Resent OTP successfully");
        toast.success("OTP has been resent to your email.");
      } else if (error) {
        // Handle any error from the resend operation
        console.error("Failed to resend OTP");
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error("An error occurred during OTP resend:", error);
      toast.error("An error occurred while resending OTP. Please try again.");
    }
  };

	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			className="flex flex-col items-center justify-center gap-6 h-screen"
		>
			<div>
				<img src={VerifyEmailSVG} alt="" className="h-[200px]" />
			</div>

			<div className="flex items-center flex-col">
				<h1 className="text-3xl font-bold">Verify your Identity</h1>
				<p className="p-2">
					Check your student email for the six digit code sent to the student email
					entered
				</p>

				<VerificationAccountInput codeLength={6} />
        <p >
          Didn't receive an OTP? Click <button onClick={handleResendOTP} className="text-primary">here</button> to resend.
        </p>
			</div>
		</motion.div>
	);
};

export default VerifyAccount;
