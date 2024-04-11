import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { VerifyEmailSVG } from "../assets";
import { VerifyCodeInput } from "../components";
import { motion } from "framer-motion";

import { resendOTP } from "../utils";
import { toast } from "react-toastify";

const VerifyUserPass = () => {
	// Get the username parameter from the URL
	const { username } = useParams();

	// Set state to manage when a user can resend OTP
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [countdown, setCountdown] = useState(120);

	// Use the resendOTP function to resend OTP
	const handleResendOTP = async (e) => {
		e.preventDefault();

		try {
			// Use the resendOTP function to resend OTP
			await toast.promise(resendOTP(username), {
				pending: "Resending OTP...",
				success: "OTP has been resent to your email.",
				error: "Failed to resend OTP. Please try again.",
			});
			
			// Reset the countdown and update state to prevent frequent resending
			setCountdown(300);
			setCanResendOTP(false);

		} catch (err) {
			// Handle any unexpected errors
			toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
		}
	};

	useEffect(() => {
    let timer;
  
    // Start the countdown when the component mounts or when canResendOTP becomes true
    if (canResendOTP || (canResendOTP === false && countdown > 0)) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
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
				<h1 className="text-3xl font-bold">Verify your email</h1>
				<p className="p-2">
					Check your email for the six digit code 
				</p>

				<VerifyCodeInput codeLength={6} />
				<p >
          Didn&apos;t receive an OTP? {canResendOTP ? (
            `Click the button below to resend.`
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

export default VerifyUserPass;
