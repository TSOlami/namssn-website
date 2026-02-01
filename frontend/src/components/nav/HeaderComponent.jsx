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
		<div className="flex flex-row border-b-2 border-blue-700 justify-between w-[100%] items-center gap-2 p-5 md:py-2 drop-shadow-md pr-14 md:pr-5">
			{back && (
				<div
					onClick={handleBack}
					className="text-2xl p-2 pr-5 cursor-pointer"
				>
					<IoChevronBackSharp />
				</div>
			)}
			<img
				src={Avatar}
				alt="avatar"
				className={location.pathname === '/home' ? "lg:hidden profile-image-small" : "lg:hidden profile-image-small mr-auto"}
				onClick={handleNavOpen}
			/>
			{/* <h1 className="text-xl text-center w-full md:text-3xl">{title}</h1> */}
			<div className="">
				<span className="px-4  font-bold font-crimson sm:text-xl text-blue-900 text-xl">
					{title.toUpperCase()}
				</span>
			</div>
			{url && (
				<div className="items-center lg:flex">
					<form
						action=""
						onSubmit={handleSubmit}
						className="flex  relative"
					>
						<input
							type="text"
							placeholder="Search"
							name="search"
							value={search}
							className="rounded-xl rounded-r-none border-gray-300 border-2 p-1 max-w-[7em]  pl-3 pr-10"
							onChange={handleSearchChange}
						/>
						<a
							className="absolute right-0 flex self-center justify-center text-white bg-black p-2 rounded-none h-full hover:text-lg"
							onClick={handleSubmit}
						>
							<FaMagnifyingGlass />
						</a>
					</form>
				</div>
			)}
		</div>
	);
};

export default HeaderComponent;
