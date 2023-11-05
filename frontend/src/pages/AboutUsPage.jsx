import { AboutImg } from "../assets";
import { Footer, NavBar } from "../components";
import Team from "../components/Team";
import { teamMembers } from "../constants";
import { motion } from "framer-motion";
const AboutUsPage = () => {
	return (
		<motion.main
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
		>
			<NavBar />
			<div className="pt-24 p-10">
				<div className="font-bold text-3xl px-8">About Us</div>
				<h1 className=" md:text-center font-bold text-3xl md:text-4xl p-4 md:p-8">
					Know more about NAMSSN FUTMINNA, your HOD, your Excos, and
					the 2+2 of the department.
				</h1>
				<div className="flex items-center justify-center">
					<img src={AboutImg} alt="" />
				</div>

				<p className="text-xl font-roboto md:p-10 p-5 md:w-[80%] m-auto my-5">
					We believe in the power of collective learning, and we&apos;ve
					designed this platform to help you excel academically while
					also providing a space for social interaction. Join us and
					be part of a community dedicated to success, growth, and
					unity.
					<br />
					<br />
					Get started today by registering or logging in to your
					account. Explore our features, connect with your peers, and
					take advantage of the resources at your fingertips.
					<br />
					<br />
					NAMSSN FUTMINNA Chapter is your key to academic excellence,
					a thriving social network, and a source of endless
					inspiration. Welcome to the journey of knowledge,
					connection, and success.{" "}
				</p>

				{/* Principal offices */}

				<h1 className="text-2xl font-bold text-center p-5">
					Principal Offices of the{" "}
					<span className="underline underline-blue underline-offset-2">
						Department
					</span>
				</h1>
				<div className="flex flex-row flex-wrap gap-5 items-center justify-center p-5 mb-10">
					{teamMembers
						.filter((member) => member.team === "Principal")
						.map((member, index) => (
							<div key={index}>
								<Team
									name={member.name}
									position={member.role}
									image={member.image}
									facebook={member.facebook}
									twitter={member.twitter}
									linkedin={member.linkedin}
								/>
							</div>
						))}
				</div>

				{/* Excos */}
				<h1 className="text-2xl font-bold text-center p-5 pb-2">
					NAMSSN Executives{" "}
				</h1>
				<h1 className="text-primary text-2xl font-bold p-5 pt-0 text-right lg:flex lg:items-center lg:justify-center lg:relative lg:left-[50%] lg:w-fit">
					2022/2023 Session
				</h1>

				<div className="flex flex-row flex-wrap gap-5 items-center justify-center p-5 mb-10">
					{teamMembers
						.filter((member) => member.team === "Executive")
						.map((member, index) => (
							<div key={index}>
								<Team
									name={member.name}
									position={member.role}
									image={member.image}
									facebook={member.facebook}
									twitter={member.twitter}
									linkedin={member.linkedin}
								/>
							</div>
						))}
				</div>

				{/* Tech team */}
				<h1 className="text-2xl font-bold text-center p-5 pb-2">
					&lt; NAMSSN Tech Team /&gt;
				</h1>

				<div className="flex flex-row flex-wrap gap-5 items-center justify-center p-5 mb-10">
					{teamMembers
						.filter((member) => member.team === "Tech")
						.map((member, index) => (
							<div key={index}>
								<Team
									name={member.name}
									position={member.role}
									image={member.image}
									facebook={member.facebook}
									twitter={member.twitter}
									linkedin={member.linkedin}
								/>
							</div>
						))}
				</div>
			</div>

			{/* Footer */}
			<Footer />
		</motion.main>
	);
};

export default AboutUsPage;
