import * as Yup from "yup";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	FaRegUser,
	FaIdCard,
	FaEnvelope,
	FaRegEye,
	FaRegEyeSlash,
	FaLock,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {FormErrors, InputField } from "../../components";
import Loader from "../Loader";
import { useRegisterMutation, setCredentials } from "../../redux";

const SignUpForm = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      navigate('/home');
    }
  }, [navigate, userInfo]);

  const [ register, { isLoading }] = useRegisterMutation();

	// Formik and yup validation schema
	const initialvalues = {
		name: "",
		username: "",
		email: "",
		password: "",
	};
	const validationSchema = Yup.object({
		name: Yup.string()
			.min(5, "Must be 5 characters or more")
			.required("Name is required"),
		username: Yup.string().required("A username is required"),
		email: Yup.string()
			.email("Invalid email address")
			.required("Email is required"),
		password: Yup.string()
			.min(8, "Password should be minimum of 8 characters")
			.required("Password is required"),
	});
	const formik = useFormik({
		initialValues: initialvalues,
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
        console.log(values);
        const res = await register(values).unwrap();
        console.log(res);
        dispatch(setCredentials({...res}));
        navigate('/home');
        toast.success('Registration successful. Welcome to NAMSSN (FUTMINNA)!');
      } catch (err) {
        toast.error(err?.data?.message || err?.error)
      }
		},
	});

	return (
    <form onSubmit={formik.handleSubmit}
    className="flex flex-col">
		<label className="mt-2" htmlFor="name">
			Full Name
    </label>

    <InputField
      type="text"
      name="name"
      id="name"
      onChange={formik.handleChange("name")}
      value={formik.values.name}
      onBlur={formik.handleBlur("name")}
      icon={<FaRegUser />}
      pad
      placeholder="Enter your full name"
    />

    {formik.touched.name && formik.errors.name ? (
      <FormErrors error={formik.errors.name} />
    ) : null}

    <label className="mt-2" htmlFor="username">
      Username
    </label>

    <InputField
      type="text"
      name="username"
      id="username"
      onChange={formik.handleChange("username")}
      value={formik.values.username}
      onBlur={formik.handleBlur("username")}
      icon={<FaIdCard />}
      pad
      placeholder="Enter Username"
    />

    {formik.touched.username && formik.errors.username ? (
      <FormErrors error={formik.errors.username} />
    ) : null}

    <label className="mt-2" htmlFor="email">
      E-mail
    </label>

    <InputField
      type="text"
      name="email"
      id="email"
      onChange={formik.handleChange("email")}
      value={formik.values.email}
      onBlur={formik.handleBlur("email")}
      om
      icon={<FaEnvelope />}
      pad
      placeholder='Enter email'
    />

    {formik.touched.email && formik.errors.email ? (
      <FormErrors error={formik.errors.email} />
    ) : null}

    <label className="mt-2" htmlFor="password">
      Password
    </label>
    <div className="flex flex-row relative w-full">
      <InputField
        type={showPassword ? "text" : "password"}
        name="password"
        id="password"
        onChange={formik.handleChange("password")}
      value={formik.values.password}
      onBlur={formik.handleBlur("password")}
        icon={<FaLock />}
        pad
        placeholder='Enter password'
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
    </div>
    {formik.touched.password && formik.errors.password ? (
      <FormErrors error={formik.errors.password} />
    ) : null}

    { isLoading && <Loader />}

    <button
      type="submit"
      className="bg-black p-2 w-full text-white rounded-lg hover:bg-slate-700 my-5"
    >
      Sign Up
    </button>

    <div className="text-right">
      Already have an account?{" "}
      <Link to="/signin" className="text-primary">
        Sign In
      </Link>
    </div>
	</form>		
	);
};

export default SignUpForm;