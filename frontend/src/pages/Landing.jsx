import { NavBar, Footer } from "../components";
import { Hero, AboutUs, Features, FAQs, ContactUs } from "../sections";
import { motion } from "framer-motion";

const Landing = () => {
	return (
		<motion.main
			initial={{ opacity: 0, x: 1000 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			transition={{ duration: 0.5 }}
			className="relative overflow-hidden"
		>
			<NavBar />
			<section className="xl:padding-1 wide:padding-r padding-b">
				<Hero />
			</section>
			<section className="padding">
				<AboutUs />
			</section>
			<section className="padding">
				<Features />
			</section>
			<section className="padding">
				<FAQs />
			</section>
			<section className="padding" id="contact-us">
				<ContactUs />
			</section>
			<section>
				<Footer />
			</section>
		</motion.main>
	);
};

export default Landing;
