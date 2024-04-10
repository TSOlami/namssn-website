import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';

import { ProfileImg } from "../../assets";
import InputField from '../InputField';
import FormErrors from './FormErrors';
import { useUpdateUserMutation, setCredentials } from '../../redux';
import { Loader } from '../../components';
import { convertToBase64 } from '../../utils';

const EditProfileForm = ({ handleModal }) => {

  const [file, setFile] = useState();
  // Use the useDispatch hook to dispatch actions 
  const dispatch = useDispatch();

  // Use the useNavigate hook to navigate to a different page
  const navigate = useNavigate();
  
  // Use the useSelector hook to access the userInfo object from the state
  const { userInfo } = useSelector((state) => state.auth);

  let profilePicture = userInfo?.profilePicture || ProfileImg;

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
    level: userInfo?.level || 'Non-Student',
	};

  const levelOptions = ['100', '200', '300', '400', '500', 'Non-Student'];
  
	// Define the validation schema using Yup
	const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    level: Yup.string().required("Please select your level"),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    matricNumber: Yup.string()
    .matches(
      /^20\d{2}\/1\/\d{5}PM$/,
      'Invalid matric number format (e.g., 20XX/1/XXXXXPM)'
    ),
    bio: Yup.string(),
	});
  
	// Create a Formik instance
	const formik = useFormik({
      initialValues,
      validationSchema,
      onSubmit: async (values) => {
        try {
          let updatedValues = Object.assign(values, { profilePicture: file || userInfo?.profilePicture });
          // Call the updateUser function to update the user's profile
          const res = await toast.promise(updateUser(updatedValues).unwrap(), {
            pending: 'Updating profile...',
            success: 'Profile updated successfully',
          });

          // Dispatch the setCredentials action to update the userInfo object in the state
          dispatch(setCredentials({...res}));
          navigate('/profile');
          handleModal();
        } catch (err) {
          toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
        }
      },
	});

  // File upload handler
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  if (isLoading) {
    return <Loader />; // Render the Loader while data is being fetched
  }
  
  return (
    <div className="bg-white rounded-2xl p-4 w-96">
      <div className="flex flex-row justify-between items-center">
        <span className="font-semibold text-lg">Update Your Profile</span>
        <button onClick={handleModal} className="text-xl text-gray-700 hover:bg-black hover:text-white p-2 rounded-md">
          <FaXmark />
        </button>
      </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2 mx-2 mt-2">
        <div className="flex-row">
        <label htmlFor="profile">
          <img src={file || profilePicture || ProfileImg} alt="" className='profile-image m-2'/>
          </label>

          <input onChange={onUpload} type="file" name="profile" id="profile" className="" style={{ display: 'none' }}/>
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
            <FormErrors error={formik.errors.name} />
          ) : null}
        </div>
        <label className="mt-2" htmlFor="level">
        Level
      </label>
      <select
        name="level"
        id="level"
        onChange={formik.handleChange("level")}
        onBlur={formik.handleBlur("level")}
        value={formik.values.level}
        className="w-full border border-gray-300 rounded p-2 m-0"
      >
        <option value="" disabled>
          Select your level
        </option>
        {levelOptions?.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      {formik.touched.level && formik.errors.level ? (
        <FormErrors error={formik.errors.level} />
      ) : null}
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
