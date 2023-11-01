import { useState } from "react";
import { BlogCard, HeaderComponent, Sidebar } from "../components";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegPlusSquare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { FormErrors, Loader } from "../components";
import { convertToBase64 } from "../utils";
import { useCreateBlogMutation, useAllBlogsQuery, useUpdateBlogMutation, useDeleteBlogMutation, setBlogs } from "../redux";

const AdminBlogs = () => {
  // Use the useSelector hook to access the userInfo object from the state
  const { userInfo } = useSelector((state) => state.auth);

  const author = userInfo?.name;
	// Use the useDispatch hook to dispatch actions
	const dispatch = useDispatch();

	// Use the useCreateBlogMutation hook to create a new blog post
	const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();

	// Use the useAllBlogsQuery hook to fetch all blogs
	const { data: blogs, isLoading: isFetching } = useAllBlogsQuery();

  // Use the useUpdateBlogMutation hook to update a blog post
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  // Use the useDeleteBlogMutation hook to delete a blog post
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

	const [showAddBlogForm, setShowBlogForm] = useState(false);
	const handleShowBlogForm = () => {
		setShowBlogForm(!showAddBlogForm);
	};

	// Define initial values for formik
	const initialValues = {
		title: "",
		content: "",
    tags: [],
    author: author,
	};

	// Define file state
	const [file, setFile] = useState();

	// Define validation schema for formik
	const validationSchema = Yup.object({
		title: Yup.string().required("Required"),
		content: Yup.string().required("Required"),
    tags: Yup.array()
    .min(1, "At least one tag is required")
    .required("Required"),
	});

	// Create a formik instance
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			try {
				let updatedValues = Object.assign(values, { coverImage: file });
        const res = await createBlog(updatedValues).unwrap();
        dispatch(setBlogs({...res}));
        formik.resetForm();
        toast.success("Blog post created successfully");
				console.log(values);
			} catch (error) {
				if (error.data.message == 'request entity too large') {
					toast.error('Image size should be less than 200KB');
				}
				console.log(error);
			}
		},
	});

  // Edit and delete blog handlers
  const handleEditBlog = (blog) => {
    console.log("Edit blog ", blog._id);
  };

  const handleDeleteBlog = async (blog) => {
    // Delete the blog post
    try {
      const blogId = blog._id;
      await deleteBlog(blogId).unwrap();
      toast.success("Blog post deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.error);
    }
  };

	// File upload handler
	const onUpload = async e => {
		const base64 = await convertToBase64(e.target.files[0]);
		setFile(base64);
	};

	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			className="flex flex-row"
		>
			<Sidebar />

			<div className="w-full">
				<HeaderComponent title="Blogs" url back />

				{showAddBlogForm ? null : (
					<div>
						<div className="p-5">
							<div className="flex flex-row justify-between px-4 items-center">
								<h1 className="text-2xl font-semibold underline decoration-dotted p-4">
									Posted Blogs
								</h1>
								<button
									onClick={handleShowBlogForm}
									className="h-fit p-2 bg-black text-white rounded-lg hover:scale-105"
								>
									Add New Blog Post
								</button>
							</div>
						</div>

						<div className="p-2 md:p-5">
							{blogs?.map((blog) => (
								<BlogCard 
                key={blog._id} 
                blog={blog}
                editBlog={() => handleEditBlog(blog)}
                deleteBlog={() => handleDeleteBlog(blog)} />
							))}
						</div>
					</div>
				)}

				{/* Add blog form */}

				{showAddBlogForm ? (
					<div className="flex items-center flex-col justify-center w-full px-5">
						<div className="flex flex-row flex-wrap justify-between w-full p-4 my-5 px-5 lg:px-10">
              
              
							
						</div>

						<form
							onSubmit={formik.handleSubmit}
							className="max-w-[900px] flex flex-col w-full"
						>
              <input
								type="text"
                name="title"
                id="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur("title")}
                value={formik.values.title}
								className="text-2xl font-bold text-gray-500 p-2"
								placeholder="Add title"
							/>
              {formik.touched.title && formik.errors.title ? (
                <FormErrors error={formik.errors.title} />
              ) : null}

                <button
                   type="submit"       
                  className="p-2 bg-primary text-white rounded-md ml-auto px-4 hover:opacity-80">
                  Publish
                </button>
							<label
								htmlFor="coverImage"
								className="h-[100px] flex items-center justify-center border border-dashed border-gray-400 w-full flex-col text-xl"
							>
								<FaRegPlusSquare />
								<span>Add Cover Image</span>
							</label>
							<input
								type="file"
								name="cover-image"
								id="cover-image"
								className="hidden"
                onChange={onUpload}
                required={true}
							/>
							<textarea
                type="text"
								name="content"
								id="content"
								placeholder="Type blog post"
								className="border-gray-300 w-full border resize-none h-[200px] p-5 my-5 md:my-10"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur("content")}
                value={formik.values.content}
							></textarea>
              {formik.touched.content && formik.errors.content ? (
                <FormErrors error={formik.errors.content} />
              ) : null}
              <input
                type="text"
                name="tags"
                id="tags"
                onChange={(e) => {
                  // Split the comma-separated string into an array of tags
                  formik.setFieldValue("tags", e.target.value.split(',').map(tag => tag.trim()));
                }}
                onBlur={formik.handleBlur("tags")}
                value={formik.values.tags.join(', ')}
                className="text-2xl font-bold text-gray-500 p-2"
                placeholder="Add tags"
              />
              {formik.touched.tags && formik.errors.tags ? (
                <FormErrors error={formik.errors.tags} />
              ) : null}
						</form>
                {isCreating || isFetching || isDeleting ? <Loader /> : null}
						<button
							onClick={handleShowBlogForm}
							className="bg-black text-white p-2 rounded-lg px-4 flex ml-auto mr-[10vw]"
						>
							Go Back
						</button>
					</div>
				) : null}
			</div>
		</motion.div>
	);
};

export default AdminBlogs;
