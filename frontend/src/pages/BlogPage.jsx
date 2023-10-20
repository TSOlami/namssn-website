import { NavBar, Footer, Actions } from "../components";
import { blogPosts } from "../constants";
import { motion } from "framer-motion";

const BlogPage = () => {
	return (
		<motion.main
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
		>
			<NavBar />
			<section className="padding w-full">
				<h1 className="font-crimson text-primary text-2xl items-start mt-8">
					Recent Blog Posts
				</h1>
				<div className="flex flex-col gap-8 my-10">
					{blogPosts.map((post) => (
						<div key={post.id} className="mb-6">
							<div className="flex md:flex-row flex-col justify-between">
								<div className="flex flex-col gap-2">
									<h2 className="text-black text-2xl md:text-3xl font-bold font-merriweather">
										{post.title}
									</h2>
									<div className="flex space-x-2 gap-2.5 mt-2">
										{post.tags.map((tag, index) => (
											<span
												key={index}
												className=" font-crimson px-3 py-1 bg-tertiary rounded justify-center items-center text-black text-center text-base font-normal"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
								<div className="grid gap-y-0 mt-4 text-right">
									<p className="text-primary text-xl md:text-2xl font-bold font-crimson">
										{post.author}
									</p>
									<p className="text-xl text-black font-normal font-crimson my-2 md:my-4">
										{post.date}
									</p>
								</div>
							</div>
							<div className="flex flex-col lg:flex-row rounded-lg mt-5 bg-tertiary opacity-[50px]">
								<img
									src={post.image}
									alt="Blog Image"
									className="rounded-lg lg:w-5/6"
								/>
								<div className="p-6">
									<Actions
										upvotes={post.upvotes}
										downvotes={post.downvotes}
										shares="5"
										comments="10"
									/>
									<p className="body-text my-4">
										{post.body}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
			<Footer />
		</motion.main>
	);
};

export default BlogPage;
