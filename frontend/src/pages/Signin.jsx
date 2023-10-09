import { useFormik } from "formik";
import * as Yup from "yup";
import { SignInImage } from "../assets";
import { useState } from "react";
import { Link } from "react-router-dom";
import FormErrors from "../components/FormErrors";
import InputField from "../components/InputField";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const SignIn = () => {
	const [showPassword, setShowPassword] = useState(false);

	// Schema and configuration for form validation
	const initialvalues = {
		matricNumber: "",
		password: "",
	};
	const validationSchema = Yup.object({
		matricNumber: Yup.string()
			.required("This field is required")
			.min(5, "Must be 5 characters or more")
			.max(30, "Too long"),

		password: Yup.string()
			.required("This field is required")
			.min(8, "Must be 8 characters or more"),
	});
	const formik = useFormik({
		initialValues: initialvalues,
		validationSchema: validationSchema,
		onSubmit: (values) => {
			console.log(values);
		},
	});

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="flex flex-row w-full overflow-hidden">
			<div className="container h-screen flex flex-col justify-center md:w-[50%] p-10 relative w-full">
				{/* Circular styling top */}
				<div className="w-40 h-40 border-[40px] border-primary rounded-full absolute top-[-5rem] right-[-5rem] z-[-1]"></div>

				{/* Circular styling bottom */}
				<div className="w-40 h-40 border-[40px] border-primary rounded-full absolute bottom-[-5rem] left-[-5rem]"></div>

				{/* Page content */}

				<h1 className="font-bold text-2xl text-center pb-2">
					Welcome Back To NAMSSN Website
				</h1>
				<div className="text-center font-medium">
					Enter your details to sign in
				</div>
				<form
					onSubmit={formik.handleSubmit}
					className="flex flex-col m-5 mt-16"
				>
					<label htmlFor="matricNumber">Matric Number</label>
					<InputField
						type="text"
						name="matricNumber"
						id="matricNumber"
						onChange={formik.handleChange}
						value={formik.values.matricNumber}
					/>

					{formik.touched.matricNumber &&
					formik.errors.matricNumber ? (
						<FormErrors error={formik.errors.matricNumber} />
					) : null}

					<label className="mt-2" htmlFor="password">
						Password
					</label>
					<div className="relative flex">
						<InputField
							type={showPassword ? "text" : "password"}
							name="password"
							id="password"
							onChange={formik.handleChange}
							value={formik.values.password}
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

						{/* Focused state not working for some reason */}
					</div>

					{formik.touched.password && formik.errors.password ? (
						<FormErrors error={formik.errors.password} />
					) : null}

					<div className="text-gray-500 text-right text-md">
						Forgot Password?
					</div>
					<button
						type="submit"
						className="bg-black p-2 w-full text-white rounded-lg hover:bg-slate-700 my-5"
					>
						Log In
					</button>

					<div className="text-right">
						Don&rsquo;t have an account?{" "}
						<Link to="/signup" className="text-primary">
							Sign Up
						</Link>
					</div>
				</form>
			</div>

			{/* Vector image container */}

			<div className="w-[50%] h-full hidden md:block">
				<div
					className="bg-gradient-to-r from-cyan-500 to-blue-500 h-screen w-full flex items-center justify-center
"
				>
					<img src={SignInImage} alt="" />
				</div>
			</div>
		</div>
	);
};

export default SignIn;
