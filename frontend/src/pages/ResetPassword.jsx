import { motion } from "framer-motion";
import { ResetPasswordSVG } from "../assets";
import { FormErrors, InputField } from "../components";
import { FaLock } from "react-icons/fa6";
import { BiSolidLock } from "react-icons/bi";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
	// Form validation
	const validationSchema = Yup.object({
		newPassword: Yup.string()
			.required("Password field cannot be empty")
			.min(8, "Must be 8 characters or more"),
		confirmPassword: Yup.string()
			.required("Password field cannot be empty")
			.equals([Yup.ref("newPassword"), null], "Passwords must match"),
	});
	const initialValues = {
		newPassword: "",
		confirmPassword: "",
	};
	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: (values) => {
			console.log(values);
		},
	});

  // Navigate to login
  const navigate = useNavigate()
  const handleNavigate = navigate('/signin')

	return (
		<motion.div
			initial={{ opacity: 0, y: 300 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -100 }}
			className="flex flex-col items-center justify-center gap-6 h-screen"
		>
			<div>
				<img
					className="h-[250px] m-auto"
					src={ResetPasswordSVG}
					alt=""
				/>
			</div>
			<form
				onSubmit={formik.handleSubmit}
				className="flex items-center flex-col gap-5 w-[300px]"
			>
				<h1 className="text-3xl font-bold">Reset Your Password</h1>
				<div className="w-full">
					<InputField
						name="newPassword"
						placeholder="Enter New Password"
						pad
						icon={<FaLock />}
						onChange={formik.handleChange("newPassword")}
					/>
					{formik.touched.newPassword && formik.errors.newPassword ? (
						<FormErrors error={formik.errors.newPassword} />
					) : null}
				</div>

				<div className="w-full">
					<InputField
						name="ConfirmPassword"
						placeholder="Confirm New Password"
						pad
						icon={<BiSolidLock />}
						onChange={formik.handleChange("confirmPassword")}
					/>
					{formik.touched.confirmPassword &&
					formik.errors.confirmPassword ? (
						<FormErrors error={formik.errors.confirmPassword} />
					) : null}
				</div>

				<button onClick={handleNavigate} className="p-2 bg-primary text-white px-4 rounded-md w-[300px] mt-4 hover:opacity-80 transition-all duration-300">
					Submit
				</button>
			</form>
		</motion.div>
	);
};

export default ResetPassword;
