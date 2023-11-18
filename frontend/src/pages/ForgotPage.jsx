import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { ForgotSVG } from "../assets";
import { InputField } from "../components";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { getUser, generateOTP } from "../utils";

const ForgotPage = () => {
	const [username, setUsername] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if already submitting
    if (isSubmitting || isVerifying) {
      return;
    }

		// Check if the username is empty
		if (!username) {
			toast.error("Please enter a username.");
			return; // Stop the function execution
		}

		// Set the verify button to disabled
    setIsVerifying(true);

		// Get the user details from the database
		const user = await getUser({ username });

		// Set the verify button back to enabled
    setIsVerifying(false);


		// Check if the user exists
		if (!user) {
			toast.error("Invalid username.");
			return; // Stop the function execution
		}

		try {
			// Set the submit button to disabled
      setIsSubmitting(true);

			// Generate the OTP and send it to the user's email
			await toast.promise(generateOTP(username), {
				pending: "Generating OTP...",
				success: "OTP generated successfully.",
			});

			// Navigate to the /verify-email/:username page
			navigate(`/verify-user/${username}`);
		} catch (err) {
			toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
		} finally {
      // Set the submit button back to enabled
      setIsSubmitting(false);
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
				<img src={ForgotSVG} alt="" className="h-[200px]" />
			</div>

			<div className="flex items-center flex-col">
				<h1 className="text-3xl font-bold">Forgot your password ?</h1>
				<p className="text-center p-2">
					Enter your username and we&apos;ll send you a verification
					code to reset your password.
				</p>

				<form action="" className="flex flex-col items-center">
					<div className="w-[300px] m-5">
						<InputField
							name="username"
							type="text"
							id="username"
							placeholder="Enter your username"
							onChange={(e) => setUsername(e.target.value)}
							pad
							icon={<FaUser />}
						/>
					</div>

					{isVerifying ? (
            <button
              className="p-3 px-4 rounded-md bg-primary text-white shadow-lg flex m-auto my-5 opacity-50 cursor-not-allowed"
              disabled
            >
              Verifying Username...
            </button>
          ) : isSubmitting ? (
            <button
              className="p-3 px-4 rounded-md bg-primary text-white shadow-lg flex m-auto my-5 opacity-50 cursor-not-allowed"
              disabled
            >
              Generating OTP...
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="p-2 bg-primary text-white px-4 rounded-md w-[300px] mt-4 hover:opacity-80 transition-all duration-300"
            >
              Submit
            </button>
          )}
				</form>
			</div>
		</motion.div>
	);
};

export default ForgotPage;
