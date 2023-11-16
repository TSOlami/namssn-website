import { useState, useEffect } from "react";
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

  // Set state to manage when a user can resend OTP
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [countdown, setCountdown] = useState(120);

  const handleResendOTP = async () => {
    // Use the resendAccountVerificationOTP function to resend OTP
    try {
      await toast.promise(
        resendAccountVerificationOTP(username, studentEmail),
        {
          pending: "Resending OTP...",
          success: "OTP sent successfully, please check your student email.",
        }
      );

      // Reset the countdown and update state to prevent frequent resending
      setCountdown(120);
      setCanResendOTP(false);

    } catch (error) {
      // Handle any unexpected errors
      console.error("An error occurred during OTP resend:", error);
      toast.error("An error occurred while resending OTP. Please try again.");
    }
  };

  
  useEffect(() => {
    let timer;
  
    // Start the countdown when the component mounts or when canResendOTP becomes true
    if (canResendOTP || (canResendOTP === false && countdown > 0)) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
        console.log("Countdown:", countdown);
      }, 1000);
    }
  
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, [canResendOTP, countdown]);

  
  useEffect(() => {
    // Enable the resend button when the countdown reaches zero
    if (countdown === 0) {
      setCanResendOTP(true);
    }
  }, [countdown]);

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
          Didn&apos;t receive an OTP? {canResendOTP ? (
            `Click here to resend.`
          ) : (
            `Resend in ${countdown} seconds.`
          )}
        </p>
        {canResendOTP && (
          <button onClick={handleResendOTP} className="text-primary">
            Resend OTP
          </button>
        )}
			</div>
		</motion.div>
	);
};

export default VerifyAccount;
