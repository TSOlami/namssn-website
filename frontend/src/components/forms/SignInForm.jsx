import { useState } from "react";
import { Link } from "react-router-dom";
import { FormErrors, InputField } from "../../components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";


const SignInForm = () => {
  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    // const res = await fetch("http://localhost:5000/api/auth/signin", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ email, password }),
    // });
    console.log(email, password);
	}

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
		onSubmit: (values) => {
			console.log(values);
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
      type="text"
      name="email"
      id="email"
      onChange={formik.handleChange("email")}
      value={formik.values.email}
      onBlur={formik.handleBlur("email")}
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
        onChange={formik.handleChange("password")}
        value={formik.values.password}
        onBlur={formik.handleBlur("password")}
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
  )
}

export default SignInForm;