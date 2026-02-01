import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import { ScrollToSectionLink } from "../../utils";
import { NamssnLogo } from "../../assets";
import { navLinks } from "../../constants";

const NavBar = () => {
	const [isNavOpen, setIsNavOpen] = useState(false);

	const toggleNav = useCallback(() => {
		setIsNavOpen((prev) => !prev);
	}, []);

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (
				isNavOpen &&
				!event.target.closest(".navbar") &&
				!event.target.closest(".navbar-mobile-panel") &&
				!event.target.closest(".navbar-hamburger")
			) {
				toggleNav();
			}
		};
		document.body.addEventListener("click", handleOutsideClick);
		return () => document.body.removeEventListener("click", handleOutsideClick);
	}, [isNavOpen, toggleNav]);

	useEffect(() => {
		document.body.style.overflow = isNavOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isNavOpen]);

	return (
		<header className="navbar fixed left-0 right-0 top-0 z-[200] w-full bg-white shadow-sm">
			{/* Main header bar: logo | desktop nav | buttons | hamburger (mobile) */}
			<div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
				{/* Logo - always visible */}
				<Link
					to="/"
					className="logo-container flex shrink-0 items-center gap-2 pt-1"
					onClick={() => isNavOpen && toggleNav()}
				>
					<img src={NamssnLogo} alt="Logo" className="logo h-12 w-12 md:h-14 md:w-14" />
					<span className="logo-text text-lg font-bold md:text-xl">NAMSSN</span>
				</Link>

				{/* Desktop nav links - hidden on mobile */}
				<nav className="hidden flex-1 justify-center lg:flex">
					<ul className="flex items-center justify-evenly gap-4 xl:gap-6">
						{navLinks?.map((item) => (
							<li key={item.label}>
								{item.label === "Contact Us" ? (
									<ScrollToSectionLink
										to="contact"
										spy={true}
										smooth={true}
										offset={-100}
										duration={500}
										className="nav-text font-montserrat transition-all hover:underline"
									>
										{item.label}
									</ScrollToSectionLink>
								) : (
									<Link
										to={item.href}
										className="nav-text font-montserrat transition-all hover:underline"
									>
										{item.label}
									</Link>
								)}
							</li>
						))}
					</ul>
				</nav>

				{/* Desktop Sign Up / Log In - hidden on mobile */}
				<div className="hidden items-center gap-3 lg:flex lg:shrink-0">
					<Link to="/signup" className="button-1">
						Sign Up
					</Link>
					<Link to="/signin" className="button-2">
						Log In
					</Link>
				</div>

				{/* Hamburger - only on mobile, inside header, no border */}
				<button
					type="button"
					aria-label="Toggle menu"
					aria-expanded={isNavOpen}
					onClick={toggleNav}
					className={`navbar-hamburger flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg transition-colors hover:bg-gray-100 lg:hidden ${isNavOpen ? "active" : ""}`}
				>
					<span className="bar" />
					<span className="bar" />
					<span className="bar" />
				</button>
			</div>

			{/* Mobile menu overlay + panel (below header z-index so hamburger stays clickable) */}
			<div
				className={`fixed inset-0 z-[199] lg:hidden ${isNavOpen ? "pointer-events-auto" : "pointer-events-none"}`}
				aria-hidden={!isNavOpen}
			>
				{/* Backdrop */}
				<button
					type="button"
					aria-label="Close menu"
					className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isNavOpen ? "opacity-100" : "opacity-0"}`}
					onClick={toggleNav}
				/>
				{/* Slide-in panel */}
				<aside
					className={`navbar-mobile-panel absolute left-0 top-0 flex h-full w-[min(300px,85vw)] flex-col bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden ${isNavOpen ? "translate-x-0" : "-translate-x-full"}`}
				>
					<div className="flex flex-1 flex-col overflow-y-auto px-4 pt-6 pb-6">
						<ul className="flex flex-col gap-1">
							{navLinks?.map((item) => (
								<li key={item.label}>
									{item.label === "Contact Us" ? (
										<ScrollToSectionLink
											to="contact"
											spy={true}
											smooth={true}
											offset={-100}
											duration={500}
											closeNavbar={toggleNav}
											className="nav-text block rounded-lg px-4 py-3 font-montserrat transition-colors hover:bg-gray-100 hover:underline"
										>
											{item.label}
										</ScrollToSectionLink>
									) : (
										<Link
											to={item.href}
											onClick={toggleNav}
											className="nav-text block rounded-lg px-4 py-3 font-montserrat transition-colors hover:bg-gray-100 hover:underline"
										>
											{item.label}
										</Link>
									)}
								</li>
							))}
						</ul>
						<div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6">
							<Link
								to="/signup"
								onClick={toggleNav}
								className="button-1 w-full justify-center"
							>
								Sign Up
							</Link>
							<Link
								to="/signin"
								onClick={toggleNav}
								className="button-2 w-full justify-center"
							>
								Log In
							</Link>
						</div>
					</div>
				</aside>
			</div>
		</header>
	);
};

export default NavBar;
