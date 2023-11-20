import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { verifyPasswordOTP } from "../../utils";

const VerifyCodeInput = ({ codeLength }) => {
	// Use the useParams hook to access the username from the URL
	const { username } = useParams();

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

	const code = verificationCode.join("");
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if the code is empty
		if (!code) {
			toast.error("Please enter the verification code.");
			return; // Stop the function execution
		}

		// Verify the OTP
		await toast.promise(verifyPasswordOTP(username, code), {
			pending: "Verifying OTP...",
			success: "OTP verified successfully.",
			error: "Failed to verify OTP. Please confirm the OTP and try again or ask for a new OTP.",
		});

		// Navigate to the /reset-password page
		navigate(`/reset-password/${username}`);
	};

	return (
		<div>
			{/* Check index.css for styling */}
			<div className="verification-code-input pt-5">
				{verificationCode?.map((digit, index) => (
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
		</div>
	);
};

export default VerifyCodeInput;
