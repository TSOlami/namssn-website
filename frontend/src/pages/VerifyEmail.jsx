import { VerifyEmailSVG } from "../assets";
import { VerificationCodeInput } from "../components";
import { motion } from "framer-motion";

const VerifyEmail = () => {
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
					Check your email for the six digit code sent to the email
					entered
				</p>

				<VerificationCodeInput codeLength={6} />
			</div>
		</motion.div>
	);
};

export default VerifyEmail;
