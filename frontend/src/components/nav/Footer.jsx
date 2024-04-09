import {
	FacebookIcon,
	TwitterIcon,
	InstagramIcon,
	LinkedinIcon,
} from "../../assets";
import { navLinks } from "../../constants";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="bg-black padding-x padding-t">
			<div className="flex flex-col md:flex-row gap-20 pb-10 mx-auto border-b-4 border-gray-400 ">
				<div>
					<h1 className="flex header-text text-white">
						National Association of Mathematical Science Students of
						Nigeria
					</h1>
				</div>
				<div>
					<ul className="flex flex-col justify-center items-start ml-8 gap-6">
						{navLinks?.map((item) => (
							<li key={item.label}>
								<Link
									to={item.href}
									className="nav-text text-white hover:text-gray-400"
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div className="">
					<ul className="flex flex-col justify-center items-start ml-8 gap-6">
						<h4 className="text-lg text-white">Social links</h4>
						<li>
							<a
								href="https://www.facebook.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-white flex items-center gap-2 hover:text-gray-400"
							>
								<img
									src={FacebookIcon}
									alt="Facebook"
									className="w-6 h-6"
								/>
								Facebook
							</a>
						</li>
						<li>
							<a
								href="https://twitter.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-white flex items-center gap-2 hover:text-gray-400"
							>
								<img
									src={TwitterIcon}
									alt="Twitter"
									className="w-6 h-6"
								/>
								Twitter
							</a>
						</li>
						<li>
							<a
								href="https://www.instagram.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-white flex items-center gap-2 hover:text-gray-400"
							>
								<img
									src={InstagramIcon}
									alt="Instagram"
									className="w-6 h-6"
								/>
								Instagram
							</a>
						</li>
						<li>
							<a
								href="https://www.linkedin.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-white flex items-center gap-2 hover:text-gray-400"
							>
								<img
									src={LinkedinIcon}
									alt="LinkedIn"
									className="w-6 h-6"
								/>
								LinkedIn
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="p-4">
				<p className="flex flex-row justify-center body-text text-white">
					<span className="">Copyright © </span>
					{/* <span><img src={Copyright} alt="" className="w-full h-full" /></span> */}
					<span>
						{" "}
						2023 NAMSSN FUTMINNA Chapter. All Rights Reserved.
					</span>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
