import { useFormik } from "formik";
import * as Yup from "yup";
import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FormErrors, Loader } from "../../components";
// import { Wrapper } from "../../assets";
// import { Loader } from "../Loader";
import { useCreatePostMutation, setPosts } from "../../redux";


const AddPostForm = ({handleModalOpen, isModalOpen}) => {
  // Get user info from redux store
  // const { userInfo } = useSelector((state) => state.auth);


  // const [isModalOpen, setIsModalOpen] = useState(false)
	// const handleModalOpen = () => {
	// 	setIsModalOpen(!isModalOpen)
  //   console.log(isModalOpen)
	// }

  // Setup Dispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createPost, { isLoading }] = useCreatePostMutation();

  // Formik and yup validation schema
  const initialValues = {
      text: "",
      image: null,
    };
  
  const MAX_FILE_SIZE = 508000; //500KB

  const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

  function isValidFileType(fileName, fileType) {
    return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
  }

  const validationSchema = Yup.object({
    text: Yup.string().required("").min(2, "Too short"),
    image: Yup.mixed()
    .test("is-valid-type", "Not a valid image type", (value) =>
      !value || isValidFileType(value.name.toLowerCase(), "image")
    ) // Validate file type
    .test("is-valid-size", "Max allowed size is 500KB", (value) =>
      !value || value.size <= MAX_FILE_SIZE
    ) // Validate file size
    .notRequired() // Make the image field optional
  });
  
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values);
        const res = await createPost(values).unwrap();
        console.log(res);
        dispatch(setPosts({ ...res }));
        // Close the modal
        handleModalOpen(); 
        navigate("/home");
        toast.success("Post created successfully");
      } catch (err) {
        console.error("Failed to create a post:", err);
        toast.error(err?.data?.message || err?.error)
      }
    },
  });

  return (
    <div>
      {isModalOpen?     <form onSubmit={formik.handleSubmit}>
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
              className="w-full h-[200px] border border-gray-200 rounded-lg p-5"
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
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(event) => {
                formik.setFieldValue("image", event.currentTarget.files[0]);
              }}
            />
            {formik.touched.image && formik.errors.image && (
              <div className="text-red-500">{formik.errors.image}</div>
            )}
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
: null}
    </div>
  );
};

export default AddPostForm;
