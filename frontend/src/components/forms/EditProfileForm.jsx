import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaXmark, FaCameraRetro } from 'react-icons/fa6';

import { ProfileImg } from "../../assets";

const EditProfileForm = ({ handleModal }) => {
	// Define the initial values for the form
	const initialValues = {
    name: '',
    username: '',
    email: '',
    studentEmail: '',
    matricNumber: '',
    bio: '',
	};
  
	// Define the validation schema using Yup
	const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    studentEmail: Yup.string().email('Invalid email format'),
    matricNumber: Yup.string(),
    bio: Yup.string(),
	});
  
	// Create a Formik instance
	const formik = useFormik({
      initialValues,
      validationSchema,
      onSubmit: (values) => {
      // Handle form submission (e.g., send data to the server)
      console.log(values);
      },
	});
  
  return (
    <div className="bg-white rounded-2xl p-4 w-96">
      <div className="flex flex-row justify-between items-center">
        <span className="font-semibold text-lg">Edit Profile</span>
        <button onClick={handleModal} className="text-xl text-gray-700 hover:bg-black hover:text-white p-2 rounded-md">
          <FaXmark />
        </button>
      </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 mx-2 mt-4">
        <div className="scale-75 flex-row">
          <FaCameraRetro color="white" className="absolute left-[20%] bottom-[48%] scale-[2]" />
          <img src={ProfileImg} alt="" />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="border-2 rounded-lg border-gray-700 p-2 w-full"
            placeholder="New username"
          />
          {formik.touched.name && formik.errors.name ? (
            <div>{formik.errors.name}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            className="border-2 rounded-lg border-gray-700 p-2 w-full"
            placeholder="New username"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="border-2 rounded-lg border-gray-700 p-2 w-full"
            placeholder="New email"
          />
        </div>
        <div>
          <label htmlFor="studentEmail">Student Email</label>
          <input
            type="email"
            name="studentEmail"
            id="studentEmail"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.studentEmail}
            className="border-2 rounded-lg border-gray-700 p-2 w-full"
            placeholder="New student email"
          />
        </div>
        <div>
          <label htmlFor="matricNumber">Matric Number</label>
          <input
            type="text"
            name="matricNumber"
            id="matricNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.matricNumber}
            className="border-2 rounded-lg border-gray-700 p-2 w-full"
            placeholder="New matric number"
          />
        </div>
        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bio}
            className="border-2 rounded-lg border-gray-700 p-2 w-full"
            placeholder="New bio"
          />
        </div>
        <div>
          <button className="bg-primary text-white rounded-lg p-2 mt-2 w-full">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
