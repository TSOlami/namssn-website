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

	// Handle the cooldown time for the resend button
	const [isResendDisabled, setResendDisabled] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

	// Use the resendOTP function to resend OTP
	const handleResendOTP = async (e) => {
		e.preventDefault();

		// Check if the cooldown time is greater than 0
		if (isResendDisabled) {
      // Do nothing if the button is disabled
      return;
    }

		try {
			// Disable the resend button
			setResendDisabled(true);

			// Use the resendOTP function to resend OTP
			await toast.promise(resendOTP(username), {
				pending: "Resending OTP...",
				success: "OTP has been resent to your email.",
				error: "Failed to resend OTP. Please try again.",
			});
			
			// Set the cooldown time
			setCooldownTime(120);

			// Start the countdown
			const interval = setInterval(() => {
				setCooldownTime((prev) => prev - 1);
			}, 12000);

			// Clear the interval when the cooldown time reaches 0
			setTimeout(() => {
				clearInterval(interval);
				setResendDisabled(false);
			}, 620000);

		} catch (error) {
			// Handle any unexpected errors
			console.error("An error occurred during OTP resend:", error);
			toast.error("An error occurred while resending OTP. Please try again.");
			setResendDisabled(false);
		}
	};

	useEffect(() => {
		// Check if the cooldown time is equal to 0
		if (cooldownTime === 0) {
			// Enable the resend button
			setResendDisabled(false);
		}
	}, [cooldownTime]);

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
				<button
          onClick={handleResendOTP}
          className={`p-2 bg-primary text-white px-4 rounded-md mt-4 hover:opacity-80 transition-all duration-300 ${isResendDisabled ? 'cursor-not-allowed' : ''}`}
          disabled={isResendDisabled}
        >
          {isResendDisabled ? `Resend OTP (${cooldownTime} s)` : 'Resend OTP'}
        </button>
			</div>
		</motion.div>
	);
};

export default VerifyUserPass;
