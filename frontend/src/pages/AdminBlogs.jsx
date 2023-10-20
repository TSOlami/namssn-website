import { useState } from "react";
import { BlogCard, HeaderComponent, Sidebar } from "../components";
import { blogPosts } from "../constants";
import { motion } from "framer-motion";
import { FaRegPlusSquare } from "react-icons/fa";

const AdminBlogs = () => {
	const [showAddBlogForm, setShowBlogForm] = useState(false);
	const handleShowBlogForm = () => {
		setShowBlogForm(!showAddBlogForm);
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
				<HeaderComponent title="Blogs" url={"missing"} />

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
							{blogPosts.map((blog, index) => (
								<BlogCard key={index} title={blog.title} />
							))}
						</div>
					</div>
				)}

				{/* Add blog form */}

				{showAddBlogForm ? (
					<div className="flex items-center flex-col justify-center w-full px-5">
						<div className="flex flex-row flex-wrap justify-between w-full p-4 my-5 px-5 lg:px-10">
							<input
								type="text"
								className="text-2xl font-bold text-gray-500 p-2"
								placeholder="Add title"
							/>
							<button className="p-2 bg-primary text-white rounded-md ml-auto px-4 hover:opacity-80">
								Publish
							</button>
						</div>

						<form
							action=""
							className="max-w-[900px] flex flex-col w-full"
						>
							<label
								htmlFor="blog-cover"
								className="h-[100px] flex items-center justify-center border border-dashed border-gray-400 w-full flex-col text-xl"
							>
								<FaRegPlusSquare />
								<span>Add Cover Image</span>
							</label>
							<input
								type="file"
								name="blog-cover"
								id="blog-cover"
								className="hidden"
							/>
							<textarea
								name=""
								id=""
								placeholder="Type blog post"
								className="border-gray-300 w-full border resize-none h-[200px] p-5 my-5 md:my-10"
							></textarea>
						</form>

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
