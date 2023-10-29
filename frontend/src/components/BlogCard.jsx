const BlogCard = ({ blog, deleteBlog }) => {
	return (
		<div className="flex flex-row justify-between px-2 shadow-md m-4 items-center">
			<div className="mr-4 h-2 w-2 rounded-full bg-primary"></div>

      <div className="font-medium pr-5 mr-auto">{blog.title}</div>

      <div className="flex flex-row gap-3">
        <button onClick={deleteBlog} className="p-2 border rounded-md text-md font-medium text-white bg-red-500">Delete Post</button>
      </div>
		</div>
	);
};

export default BlogCard;
