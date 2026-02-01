import { Link } from "react-router-dom";
import { Image4, Image6 } from "../assets";
import { motion } from "framer-motion";

const Features = () => {
	return (
		<motion.section
			initial={{ opacity: 0, x: 100 }}
			whileInView={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			transition={{ duration: 0.8 }}
		>
			<h1 className="header-text text-center max-w-xl mx-auto">
				Why You Should Use NAMSSN Website
			</h1>
			<div className="flex flex-col justify-center items-center pt-16 sm:pt-10">
				<div className="flex flex-col lg:flex-row gap-4">
					<motion.div
						initial={{ rotate: 45 }}
						whileInView={{ rotate: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ duration: 0.5 }}
						className="flex md:flex-row bg-tertiary mx-auto rounded-2xl shadow-xl flex-col pb-5"
					>
						<div className="flex flex-col justify-center px-8 pt-5 pb-4">
							<h3 className="text-3xl pb-2 leading-tight font-bold font-roboto">
								E-Test: Past Questions and Practice
							</h3>
							<p className="text-xl font-roboto">
								Ace your exams with our E-Test practice feature: take timed past-question tests by course, get instant scores, and review answers with explanations – all tailored to FUTMINNA courses.
							</p>
							<Link to="/e-test" className="button-1 mt-3 inline-block w-fit">Try E-Test</Link>
						</div>
						<div className="md:w-full flex justify-center md:justify-end m-auto p-3">
							<img src={Image4} alt="" />
						</div>
					</motion.div>
					<div className="flex flex-row bg-tertiary rounded-2xl max-w-[25rem] mx-auto shadow-xl">
						<motion.div
							initial={{ rotate: 45 }}
							whileInView={{ rotate: 0 }}
							exit={{ opacity: 0, x: -100 }}
							transition={{ duration: 0.5 }}
							className="flex flex-col justify-center px-8 pt-10 pb-10"
						>
							<h3 className="text-3xl leading-tight pb-2 font-bold font-roboto">
								Interactive Discussions
							</h3>
							<p className="text-xl font-roboto mx-auto">
								Engage in thought-provoking discussions, share
								your opinions on various topics, and ask
								questions – all within a vibrant and welcoming
								community of like-minded students.
							</p>
						</motion.div>
					</div>
				</div>

				<div className="flex flex-col lg:flex-row gap-10 pt-8">
					<motion.div
						initial={{ rotateY: 45 }}
						whileInView={{ rotateY: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ duration: 0.5 }}
						className="flex flex-row bg-tertiary rounded-2xl mx-auto max-w-[25rem] shadow-xl"
					>
						<motion.div className="flex flex-col justify-center px-10 pt-10 pb-5 ">
							<h3 className="leading-tight text-3xl pb-2 font-bold font-roboto">
								Effortless Payment
							</h3>
							<p className="text-xl font-roboto">
								Easily pay your departmental dues, making
								financial transactions a breeze.
							</p>
						</motion.div>
					</motion.div>
					<motion.div
						initial={{ x: 100 }}
						whileInView={{ x: 0 }}
						transition={{ type: "spring", stiffness: 100 }}
						className="flex md:flex-row flex-col bg-zinc-900 mx-auto rounded-2xl shadow-xl"
					>
						<motion.div className="flex flex-col justify-center px-10 pt-20 pb-10">
							<h3 className="text-3xl leading-tight pb-2 text-white font-bold font-roboto">
								Stay Informed
							</h3>
							<p className="text-xl text-white font-roboto">
								Keep up to date with all the latest campus
								events, blog news, and important updates. Never
								miss a beat when it comes to what&apos;s
								happening at FUTMINNA.
							</p>
						</motion.div>
						<img
							src={Image6}
							alt=""
							className="w-fit self-center"
						/>
					</motion.div>
				</div>
			</div>
		</motion.section>
	);
};

export default Features;
