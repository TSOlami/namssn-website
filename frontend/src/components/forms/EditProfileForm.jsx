import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaXmark, FaCameraRetro } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';

import { ProfileImg } from "../../assets";
import InputField from '../InputField';
import FormErrors from './FormErrors';
import { useUpdateUserMutation, setCredentials } from '../../redux';
import { Loader } from '../../components';

const EditProfileForm = ({ handleModal }) => {
  // Use the useDispatch hook to dispatch actions 
  const dispatch = useDispatch();

  // Use the useNavigate hook to navigate to a different page
  const navigate = useNavigate();
  
  // Use the useSelector hook to access the userInfo object from the state
  const { userInfo } = useSelector((state) => state.auth);

  // Use the useUpdateUserMutation hook to update the user's profile
  const [updateUser, { isLoading }] = useUpdateUserMutation();

	// Define the initial values for the form based on userInfo
	const initialValues = {
    name: userInfo?.name || '',
    username: userInfo?.username || '',
    email: userInfo?.email || '',
    studentEmail: userInfo?.studentEmail || '',
    matricNumber: userInfo?.matricNumber || '',
    bio: userInfo?.bio || '',
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
      onSubmit: async (values) => {
        try {
          const res = await updateUser(values).unwrap();
          dispatch(setCredentials({...res}));
          navigate('/home');
          toast.success('Profile updated!');
        } catch (err) {
          toast.error(err?.data?.message || err?.error)
        }
      },
	});
  
  return (
    <div className="bg-white rounded-2xl p-4 w-96">
      <div className="flex flex-row justify-between items-center">
        <span className="font-semibold text-lg">Update Your Profile</span>
        <button onClick={handleModal} className="text-xl text-gray-700 hover:bg-black hover:text-white p-2 rounded-md">
          <FaXmark />
        </button>
      </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2 mx-2 mt-4">
        <div className="scale-75 flex-row">
          <FaCameraRetro color="white" className="absolute left-[17%] bottom-[48%] scale-[2]" />
          <img src={ProfileImg} alt="" className='h-[130px]'/>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <InputField
            type="text"
            name="name"
            id="name"
            placeholder="Your new full name"
            autoComplete="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur("name")}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div>{formik.errors.name}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <InputField
            type="text"
            name="username"
            id="username"
            placeholder="Your new username"
            autoComplete="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur("username")}
            value={formik.values.username}
          />
          {formik.touched.username &&
          formik.errors.username ? (
            <FormErrors error={formik.errors.username} />
          ) : null}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <InputField
            type="email"
            name="email"
            id="email"
            placeholder="Your New email"
            autoComplete="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur("email")}
            value={formik.values.email}
          />
          {formik.touched.email &&
          formik.errors.email ? (
            <FormErrors error={formik.errors.email} />
          ) : null}
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
            autoComplete="email"
          />
          {formik.touched.studentEmail &&
          formik.errors.studentEmail ? (
            <FormErrors error={formik.errors.studentEmail} />
          ) : null}
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
            className="border-2 rounded-lg border-gray-700 p-2 w-full resize-none"
            placeholder="New matric number"
          />
          {formik.touched.matricNumber &&
          formik.errors.matricNumber ? (
            <FormErrors error={formik.errors.matricNumber} />
          ) : null}
        </div>
        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bio}
            className="border-2 rounded-lg border-gray-700 p-2 w-full resize-none"
            placeholder="New bio"
          />
          {formik.touched.bio &&
          formik.errors.bio ? (
            <FormErrors error={formik.errors.bio} />
          ) : null}
        </div>
        <div>

          {isLoading && <Loader />}

          <button 
          type='submit'
          className="bg-primary text-white rounded-lg p-2 mt-2 w-full">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
