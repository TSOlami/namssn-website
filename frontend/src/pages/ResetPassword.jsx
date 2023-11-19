import { motion } from "framer-motion";
import { ResetPasswordSVG } from "../assets";
import { FormErrors, InputField } from "../components";
import { FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { BiSolidLock } from "react-icons/bi";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";

import { useResetPasswordMutation, useSendMailMutation } from "../redux";
import { toast } from "react-toastify";
import { useState } from "react";

const ResetPassword = () => {
	// State to manage the password visibility
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	// Function to toggle the password visibility
	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};
	const handleShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword)
	}

	// Get the username parameter from the URL
	const { username } = useParams();

	// Use the useResetPasswordMutation hook to reset the user's password
	const [resetPassword] = useResetPasswordMutation();

	// Use the useSendMailMutation hook to send a congratulatory email to the user
	const [sendMail] = useSendMailMutation();

	// Define a mail text
	const msg =
		"Your password has been successfully reset. You can now login with your new password. If you didn't request this change, please contact our support team immediately.";

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
				const res = await toast.promise(
					resetPassword({ username, password }),
					{
						pending: "Resetting password...",
					}
				);

				if (res.data) {
					// Send a congratulatory email to the user
					await sendMail({
						username,
						userEmail: res?.data?.email,
						text: msg,
					});
					// Display a success message
					toast.success(
						"Password reset successfully. You will be redirected to the sign-in page to login with your new password."
					);
					setTimeout(() => {
						navigate("/signin");
					}, 3000); // Redirect to sign-in page after 3 seconds
				}

				toast.error(
					res?.error?.error?.data?.message ||
						res?.error?.data?.message
				);
			} catch (err) {
				toast.error(
					err?.error?.response?.data?.message ||
						err?.data?.message ||
						err?.error
				);
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
				<div className="w-full relative flex">
					<InputField
						name="newPassword"
						type={showPassword ? "text" : "password"}
						placeholder="Enter New Password"
						pad
						icon={<FaLock />}
						onChange={formik.handleChange("newPassword")}
					/>

					{showPassword ? (
						<FaRegEyeSlash
							className="absolute right-2 flex self-center justify-center"
							onClick={handleShowPassword}
						/>
					) : (
						<FaRegEye
							className="absolute right-2 flex self-center justify-center"
							onClick={handleShowPassword}
						/>
					)}
					{formik.touched.newPassword && formik.errors.newPassword ? (
						<FormErrors error={formik.errors.newPassword} />
					) : null}
				</div>

				<div className="w-full relative flex">
					<InputField
						name="ConfirmPassword"
						type={showConfirmPassword ? "text" : "password"}
						placeholder="Confirm New Password"
						pad
						icon={<BiSolidLock />}
						onChange={formik.handleChange("confirmPassword")}
					/>

					{showConfirmPassword ? (
						<FaRegEyeSlash
							className="absolute right-2 flex self-center justify-center"
							onClick={handleShowConfirmPassword}
						/>
					) : (
						<FaRegEye
							className="absolute right-2 flex self-center justify-center"
							onClick={handleShowConfirmPassword}
						/>
					)}
					{formik.touched.confirmPassword &&
					formik.errors.confirmPassword ? (
						<FormErrors error={formik.errors.confirmPassword} />
					) : null}
				</div>

				<button
					type="submit"
					className="p-2 bg-primary text-white px-4 rounded-md w-[300px] mt-4 hover:opacity-80 transition-all duration-300"
				>
					Submit
				</button>
			</form>
		</motion.div>
	);
};

export default ResetPassword;
