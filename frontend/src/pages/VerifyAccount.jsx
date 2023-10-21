import { VerifyEmailSVG } from "../assets";
import { VerificationAccountInput } from "../components";
import { motion } from "framer-motion";

const VerifyAccount = () => {
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
			</div>
		</motion.div>
	);
};

export default VerifyAccount;
