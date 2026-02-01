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
import { convertToBase64 } from '../../utils';

const EditProfileForm = ({ handleModal }) => {

  const [file, setFile] = useState();
  const [coverFile, setCoverFile] = useState();
  // Use the useDispatch hook to dispatch actions 
  const dispatch = useDispatch();

  // Use the useNavigate hook to navigate to a different page
  const navigate = useNavigate();
  
  // Use the useSelector hook to access the userInfo object from the state
  const { userInfo } = useSelector((state) => state.auth);

  let profilePicture = userInfo?.profilePicture || ProfileImg;
  const coverPhoto = userInfo?.coverPhoto;

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
          let updatedValues = Object.assign(values, {
            profilePicture: file || userInfo?.profilePicture,
          });
          if (coverFile !== undefined) updatedValues.coverPhoto = coverFile || '';
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

  const onCoverUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setCoverFile(base64);
  };

  const coverPreview = coverFile || coverPhoto;

  return (
    <div className="bg-white rounded-2xl p-4 w-96 max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto">
      <div className="flex flex-row justify-between items-center">
        <span className="font-semibold text-lg">Update Your Profile</span>
        <button onClick={handleModal} className="text-xl text-gray-700 hover:bg-black hover:text-white p-2 rounded-md">
          <FaXmark />
        </button>
      </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2 mx-2 mt-2">
        {/* Cover photo — click the button to upload cover only */}
        <div className="space-y-1.5 -mx-2">
          <span className="text-sm font-medium text-gray-700 block">Cover photo</span>
          <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100 h-24">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No cover photo
              </div>
            )}
          </div>
          <label htmlFor="cover" className="inline-block">
            <span className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 cursor-pointer hover:bg-gray-50">
              {coverPhoto || coverFile ? "Change cover photo" : "Add cover photo"}
            </span>
            <input onChange={onCoverUpload} type="file" accept="image/*" name="cover" id="cover" className="sr-only" />
          </label>
        </div>
        {/* Profile picture — click the button to upload profile pic only */}
        <div className="space-y-1.5">
          <span className="text-sm font-medium text-gray-700 block">Profile picture</span>
          <div className="flex items-center gap-3">
            <div className="rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 w-20 h-20 flex-shrink-0">
              <img
                src={file || profilePicture || ProfileImg}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            </div>
            <label htmlFor="profile" className="inline-block">
              <span className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 cursor-pointer hover:bg-gray-50">
                {(profilePicture || file) ? "Change profile picture" : "Add profile picture"}
              </span>
              <input onChange={onUpload} type="file" accept="image/*" name="profile" id="profile" className="sr-only" />
            </label>
          </div>
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
        <Select
          label="Level"
          name="level"
          id="level"
          options={levelOptions}
          value={formik.values.level}
          onChange={formik.handleChange("level")}
          onBlur={formik.handleBlur("level")}
          placeholder="Select your level"
          error={formik.touched.level && formik.errors.level ? formik.errors.level : undefined}
        />
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
          disabled={isLoading}
          className={`bg-primary text-white rounded-lg p-2 mt-2 w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
