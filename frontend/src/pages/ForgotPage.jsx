import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { ForgotSVG } from "../assets";
import { InputField } from "../components";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ForgotPage = () => {
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	// navigate to enter reset password page
	const handleNavigate = ()=>{
		navigate('/reset-password')
	}

	const handleSubmit = async (e) => {
		e.preventDef;
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
				<p className="p-2">
					Enter your username and we&apos;ll send you a verification
					code to reset your password.
				</p>

				<div className="w-[300px] m-5">
					<InputField
						placeholder="Enter your username"
						onChange={setUsername}
						pad
						icon={<FaUser />}
					/>
				</div>

				<button onClick={handleNavigate} className="p-2 bg-primary text-white px-4 rounded-md w-[300px] mt-4 hover:opacity-80 transition-all duration-300">Submit</button>
			</div>
		</motion.div>
	);
};

export default ForgotPage;
