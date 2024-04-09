import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import { ScrollToSectionLink } from "../../utils";
import { NamssnLogo } from "../../assets";
import { navLinks } from "../../constants";

const NavBar = () => {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const handleNavOpen = useCallback(() => {
    setIsNavOpen((prevIsNavOpen) => !prevIsNavOpen);
  }, []);

	useEffect(() => {
		const hamburger = document.querySelector(".hamburger");

		hamburger.addEventListener("click", handleNavOpen);

		return () => {
			hamburger.removeEventListener("click", handleNavOpen);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isNavOpen]);

	useEffect(() => {
		const handleOutsideClick = (event) => {
			// Check if the click target is outside the navbar
			if (
				isNavOpen &&
				event.target.closest(".navbar") === null &&
				event.target.closest(".hamburger") === null
			) {
				// Close the navbar
				handleNavOpen();
			}
		};
	
		// Add event listener to the document body
		document.body.addEventListener("click", handleOutsideClick);
	
		return () => {
			// Remove event listener when the component unmounts
			document.body.removeEventListener("click", handleOutsideClick);
		};
	}, [isNavOpen, handleNavOpen]);
	
	isNavOpen? document.body.style.overflow = "hidden" : document.body.style.overflow = "auto";

	return (
		<header className="px-[10px] my-4 mx-2 w-full fixed top-[-16px] z-[200]">
			{/* Namssn logo, absolute code, avoid abeg */}
			<div>
				<div className="flex flex-row items-center absolute lg:hidden bg-white w-full">
					<Link to="/">
						<img src={NamssnLogo} alt="Logo" className="logo pt-3"/>
					</Link>
					<span className="logo-text py-[2px]">NAMSSN</span>
				</div>
			</div>

			{/* Navbar */}
			<nav
				className={
					isNavOpen
						? "bg-white flex flex-col lg:flex-row lg:justify-between md:items-center h-full lg:h-auto z-10 fixed left-0 w-[315px] lg:static lg:w-auto transition-all duration-400"
						: "bg-white flex flex-col lg:flex-row lg:justify-between md:items-center h-full lg:h-auto z-10 fixed left-[-100%] w-[315px] lg:static lg:w-auto transition-all duration-400"
				}
			>
				<div className="logo-container pt-2">
					<Link to="/">
						<img src={NamssnLogo} alt="Logo" className="logo" />
					</Link>
					<span className="logo-text py-[2px]">NAMSSN</span>
				</div>
				<ul className="flex-1 flex justify-center lg:justify-evenly items-center ml-6 gap-10 lg:gap-3 flex-col lg:flex-row">
				{navLinks?.map((item) => (
					<li key={item.label}>
						{item.label === "Contact Us" ? (
							<ScrollToSectionLink
								to="contact"
								spy={true}
								smooth={true}
								offset={-100}
								duration={500}
								closeNavbar={handleNavOpen}
								className="nav-text hover:underline transition-all font-montserrat"
							>
								{item.label}
							</ScrollToSectionLink>
						) : (
							<Link to={item.href} className="nav-text hover:underline transition-all font-montserrat">
								{item.label}
							</Link>
						)}
					</li>
				))}
				</ul>

				<div className="pb-14 lg:pl-5 lg:p-0 gap-4 flex mx-4 items-center justify-center">
					<Link to="/signup" className="button-1">
						Sign Up
					</Link>
					<Link to="/signin" className="button-2">
						Log In
					</Link>
				</div>
			</nav>

			<div className={isNavOpen ? "hamburger active" : "hamburger"}>
				<span className="bar side"></span>
				<span className="bar side"></span>
				<span className="bar side"></span>
			</div>
		</header>
	);
};

export default NavBar;
