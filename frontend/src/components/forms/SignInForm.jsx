import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';

import { useLoginMutation, useSendMailMutation, setCredentials } from '../../redux';
import FormErrors from './FormErrors';
import InputField from "../InputField";
import { toast } from "react-toastify";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [ login ]= useLoginMutation();

  const [sendMail] = useSendMailMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      // Trigger sending the email after a successful login
      const msg = "Welcome back to NAMSSN, FUTMINNA chapter! We're excited to have you back on board.";
      const { email } = userInfo;

      if (email) {
        sendMail({ userEmail: email, text: msg }).then((response) => {
          if (response.error) {
            console.error("Failed to send email after login.");
            toast.error("Failed to send a welcome email. Please try again.");
          } else {
            console.log("Email sent successfully after login.");
          }
        });
      }
      navigate('/home');
    }
  }, [navigate, sendMail, userInfo]);

	// Schema and configuration for form validation
	const initialvalues = {
		email: "",
		password: "",
	};
	const validationSchema = Yup.object({
		email: Yup.string()
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
		onSubmit: async (values) => {
			try {
        const res = await toast.promise(login(values).unwrap(), {
          pending: 'Logging in...',
          success: "Log in successful, welcome back!",
        });

        dispatch(setCredentials({...res}));
        // Trigger sending the email after a successful login
      const msg = "Welcome back! We're excited to have you back on board.";
      const { email } = userInfo;
      const subject = "You logged in!"

      if (email) {
        sendMail({ userEmail: email, text: msg, subject }).then((response) => {
          if (response.error) {
            console.error("Failed to send email after login.");
            toast.error("Failed to send a welcome email. Please try again.");
          } else {
            console.log("Email sent successfully after login.");
          }
        });
      }
        navigate('/home');
      } catch (err) {
        toast.error(err?.data?.message || err?.error)
      }
		},
	});

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};
  return (
    <form
    onSubmit={formik.handleSubmit}
    className="flex flex-col m-5 mt-16"
  >
    <label htmlFor="email">Email</label>
    <InputField
      type="email"
      name="email"
      id="email"
      placeholder="Enter your email"
      autoComplete="email"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur("email")}
      value={formik.values.email}
    />

    {formik.touched.email &&
    formik.errors.email ? (
      <FormErrors error={formik.errors.email} />
    ) : null}

    <label className="mt-2" htmlFor="password">
      Password
    </label>
    <div className="relative flex">
      <InputField
        type={showPassword ? "text" : "password"}
        name="password"
        id="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur("password")}

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

    <Link to="/forgot-password" className="text-gray-500 text-right text-md">
      Forgot Password?
    </Link>
    <button
      type="submit"
      className="bg-black p-2 w-full text-white rounded-lg hover:bg-slate-700 my-10"
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
  )
}

export default SignInForm;