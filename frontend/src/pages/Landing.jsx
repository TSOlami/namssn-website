import { Element } from "react-scroll";
import { motion } from "framer-motion";

import { NavBar, Footer } from "../components";
import { Hero, AboutUs, Features, FAQs, ContactUs } from "../sections";

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
			<Element name="hero">
        <Hero />
      </Element>
			</section>
			<section className="padding">
			<Element name="about">
        <AboutUs />
      </Element>
			</section>
			<section className="padding">
			<Element name="features">
        <Features />
      </Element>
			</section>
			<section className="padding">
			<Element name="faqs">
        <FAQs />
      </Element>
			</section>
			<section className="padding" id="contact-us">
			<Element name="contact" id="contact-us">
        <ContactUs />
      </Element>
			</section>
			<section>
				<Footer />
			</section>
		</motion.main>
	);
};

export default Landing;
