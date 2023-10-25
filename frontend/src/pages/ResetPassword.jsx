import { motion } from "framer-motion";
import { ResetPasswordSVG } from "../assets";
import { FormErrors, InputField } from "../components";
import { FaLock } from "react-icons/fa6";
import { BiSolidLock } from "react-icons/bi";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";

import { useResetPasswordMutation, useSendMailMutation } from "../redux";
import { toast } from "react-toastify";

const ResetPassword = () => {
	// Get the username parameter from the URL
	const { username } = useParams();

	// Use the useResetPasswordMutation hook to reset the user's password
	const [resetPassword] = useResetPasswordMutation();

	// Use the useSendMailMutation hook to send a congratulatory email to the user
	const [sendMail] = useSendMailMutation();

	// Define a mail text
	const msg = "Your password has been successfully reset. You can now login with your new password. If you didn't request this change, please contact our support team immediately.";

	// Navigate to the login page
	const navigate = useNavigate();

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
		onSubmit: async (values) => {
			const password = values.newPassword;

			// Reset the password
			try {
				// Reset the password
				const res = await resetPassword({username, password});
				console.log(res);
				if (res.data) {
					console.log("Email: ", res?.data?.email );
					// Send a congratulatory email to the user
					await sendMail({ username, userEmail: res?.data?.email, text: msg });
					// Display a success message
					toast.success("Password reset successfully. You will be redirected to the sign-in page to login with your new password.");
          setTimeout(() => {
            navigate("/signin");
          }, 3000); // Redirect to sign-in page after 3 seconds
				}

				toast.error(res?.error?.error?.data?.message || res?.error?.data?.message);
			} catch (err) {
				toast.error(err?.data?.message || err?.error)

			}
		},
	});

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

				<button type="submit" className="p-2 bg-primary text-white px-4 rounded-md w-[300px] mt-4 hover:opacity-80 transition-all duration-300">
					Submit
				</button>
			</form>
		</motion.div>
	);
};

export default ResetPassword;
