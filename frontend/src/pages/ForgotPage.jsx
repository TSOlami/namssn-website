import { FaUser } from "react-icons/fa6";
import { ForgotSVG } from "../assets";
import { InputField, VerificationCodeInput } from "../components";
import { motion } from "framer-motion";

const ForgotPage = () => {
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
          Enter your username and we&apos;ll send you a
          verification code to reset your password
				</p>

        <div className="w-[300px] m-5">
          <InputField placeholder="Username" pad icon={<FaUser/>}/>
        </div>

				<VerificationCodeInput codeLength={6} />
			</div>
		</motion.div>
	);
};

export default ForgotPage;
