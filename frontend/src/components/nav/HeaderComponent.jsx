import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ProfileImg } from "../../assets";
import { useDispatch } from "react-redux";
import { setNavOpen } from "../../redux/slices/navSlice";
import { IoChevronBackSharp } from "react-icons/io5";

const HeaderComponent = ({ title, url, back }) => {
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const handleSearchChange = (e) => {
		e.preventDefault();
		if (e.target.value.trim() !== "") {
			setSearch(e.target.value);
		} else if (e.target.value.trim() === "" && search.trim() !== "") {
			setSearch(e.target.value);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (search !== "") {
			window.location.href = `/search?key=${search}&filter=all`;
		}
	};

	const handleBack = () => {
		navigate(-1);
	};

	// get user from redux
	const { userInfo } = useSelector((state) => state.auth);

	// get avatar from redux
	const Avatar = userInfo?.profilePicture || ProfileImg;

	// handle nav open with redux
	const handleNavOpen = () => {
		dispatch(setNavOpen());
	};

	return (
		<div className="flex flex-row border-b-2 border-blue-700 justify-between items-center gap-2 sm:gap-3 p-3 sm:p-4 md:py-2 drop-shadow-md w-full min-w-0">
			{/* Left: back (optional) + avatar (mobile) */}
			<div className="flex items-center gap-1 flex-shrink-0">
				{back && (
					<div
						onClick={handleBack}
						className="text-xl sm:text-2xl p-1.5 sm:p-2 cursor-pointer"
						aria-label="Go back"
					>
						<IoChevronBackSharp />
					</div>
				)}
				<img
					src={Avatar}
					alt="avatar"
					className={location.pathname === "/home" ? "lg:hidden profile-image-small w-8 h-8 sm:w-9 sm:h-9" : "lg:hidden profile-image-small w-8 h-8 sm:w-9 sm:h-9 mr-1"}
					onClick={handleNavOpen}
					aria-label="Open menu"
				/>
			</div>
			{/* Center: title - flex-1 min-w-0 so it can shrink */}
			<div className="flex-1 min-w-0 flex items-center justify-center">
				<span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold font-crimson text-blue-900 truncate px-1">
					{title.toUpperCase()}
				</span>
			</div>
			{/* Right: search + spacer for hamburger on mobile */}
			<div className="flex items-center gap-3 flex-shrink-0">
				{url && (
					<form
						action=""
						onSubmit={handleSubmit}
						className="flex relative w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] min-w-0 h-9 sm:h-10"
					>
						<input
							type="text"
							placeholder="Search"
							name="search"
							value={search}
							className="w-full h-full rounded-xl rounded-r-none border-gray-300 border-2 py-0 px-2 sm:px-3 pr-8 text-xs sm:text-sm min-w-0"
							onChange={handleSearchChange}
						/>
						<button
							type="button"
							className="absolute right-0 top-0 bottom-0 w-9 sm:w-10 flex items-center justify-center text-white bg-black rounded-r-lg hover:opacity-90"
							onClick={handleSubmit}
							aria-label="Search"
						>
							<FaMagnifyingGlass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</button>
					</form>
				)}
				{/* Spacer so hamburger (fixed right) doesn't overlap search on mobile */}
				<div className="w-10 h-10 flex-shrink-0 lg:hidden" aria-hidden="true" />
			</div>
		</div>
	);
};

export default HeaderComponent;
