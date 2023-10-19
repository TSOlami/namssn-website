import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const VerificationCodeInput = ({ codeLength }) => {
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

	useEffect(() => {

	}, []);

	const code = verificationCode.join("");
	const handleSubmit = () => {
		console.log("Verification Code: ", code);
    navigate('/home')
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
				Verify and Continue
			</button>
		</div>
	);
};

export default VerificationCodeInput;
