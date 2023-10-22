import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { ProfileImg } from "../../assets";
import { useDispatch } from "react-redux";
import { setNavOpen } from "../../redux/slices/navSlice";

const HeaderComponent = ({ title, url }) => {
	const dispatch = useDispatch();
	const [search, setSearch] = useState("");
	const handleSearchChange = (e) => {
		e.preventDefault();
		if (e.target.value.trim() !== '') {
			setSearch(e.target.value);
		} else if(e.target.value.trim() === '' && search.trim() !== '') {
			setSearch(e.target.value);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		// console.log(e.target.value);
		// setSearch(e.target.value);
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
		<div className="flex flex-row md:justify-between items-center p-5 md:py-2 border-b-2 border-gray-300 ">
			<h1 className="text-xl text-center w-full md:text-3xl">{title}</h1>
			<img
				src={Avatar}
				alt="avatar"
				className="lg:hidden profile-image-small"
				onClick={handleNavOpen}
			/>
			<form
					action=""
					onSubmit={handleSubmit}
					className="hidden md:flex  relative"
				>
					<input
						type="text"
						placeholder="Search"
						name="search"
						value={search}
						className="rounded-2xl border-gray-300 border-2 p-1 w-56 md:w-72 pl-10"
						onChange={handleSearchChange}
					/>
					<FaMagnifyingGlass className="absolute left-2 flex self-center justify-center" />
					<button className="border bg-blue-900 rounded-md text-white"> <a href={`http://localhost:3000/search?key=${search}`}>Go</a></button>
			</form>
		</div>
	);
};

export default HeaderComponent;
