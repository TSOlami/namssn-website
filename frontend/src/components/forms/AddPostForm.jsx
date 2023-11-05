import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { FormErrors, Loader } from "../../components";
import { useCreatePostMutation } from "../../redux";
import { convertToBase64 } from "../../utils";


const AddPostForm = ({handleModalOpen, appendNewPost}) => {
  // Get user info from redux store
  // const { userInfo } = useSelector((state) => state.auth);

  // Setup Dispatch
  const navigate = useNavigate();

  const [createPost, { isLoading }] = useCreatePostMutation();

  // Formik and yup validation schema
  const initialValues = {
      text: "",
    };
  
  const [file, setFile] = useState();

  const validationSchema = Yup.object({
    text: Yup.string().required("").min(2, "Too short").max(500, "Too long"),
  });
  
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        values = Object.assign(values, { image: file || ""});
        
        const res = await toast.promise(
          createPost(values).unwrap(),
          {
            pending: "Creating post...",
            success: "Post created successfully",
            error: "Failed to create post",
          }
        );

        // Append the newly created post to your local state
        // Call the appendNewPost function to append the newly created post
        appendNewPost(res);

        // Close the modal
        handleModalOpen(); 
        navigate("/home");
      } catch (err) {
        console.error("Failed to create a post:", err);
        toast.error(err?.data?.message || err?.error)
      }
    },
  });

  // File upload handler
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div>
       <form onSubmit={formik.handleSubmit}>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg w-[90%] max-w-[600px] h-[500px]">
          <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <div className="text-2xl font-bold">Create Post</div>
            <div
              className="text-3xl cursor-pointer p-2"
              onClick={handleModalOpen}
            >
              <FaXmark />
            </div>
          </div>
          <div className="p-5">
            <textarea
              className="w-full h-[200px] border border-gray-200 rounded-lg p-5 resize-none"
              id="text"
              name="text"
              type="text"
              value={formik.values.text}
              onChange={formik.handleChange("text")}
              onBlur={formik.handleBlur("text")}
              placeholder="What's on your mind?"
            />
            {formik.touched.text && formik.errors.text ? (
              <FormErrors error={formik.errors.text} />
              ) : null}
            <label htmlFor="image">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={onUpload}
            />
            </label>
          </div>
          <div className="flex justify-between items-center p-5 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 w-8 h-8 rounded-full"></div>
              <div className="bg-gray-200 w-8 h-8 rounded-full"></div>
              <div className="bg-gray-200 w-8 h-8 rounded-full"></div>
            </div>
            {isLoading && <Loader />}
            <button
              type="submit"
              className={
                formik.values.text === ""
                  ? "bg-primary text-white px-5 py-2 rounded-lg disabled pointer-events-none opacity-70"
                  : "bg-primary text-white px-5 py-2 rounded-lg"
              }
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
    </div>
  );
};

export default AddPostForm;
