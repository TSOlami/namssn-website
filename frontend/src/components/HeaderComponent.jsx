import { useState, useEffect } from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Avatar } from "../assets";
import { useDispatch } from "react-redux";
import { setNavOpen } from "../redux/slices/navSlice";
import Resources from '../pages/Resources';
import { Link } from 'react-router-dom';

const HeaderComponent = ({title}) => {
	const dispatch = useDispatch();
	const [search, setSearch] = useState("");
	const handleSearchChange = (e) => {
		e.preventDefault();
		setSearch(e.target.value);
	};

	const handleSearch = () => {
		
	}

	// const handleSubmit = (e) => {
	// 	console.log(e.target.value)
	// 	e.preventDefault();
	// 	setSearch(e.target.value);
	// }
	
	useEffect(() => {
		console.log(search);
		
	}, [search])


	// handle nav open with redux
	const handleNavOpen = () => {
		dispatch(setNavOpen());
	};

	return (
		<div className="flex flex-row-reverse md:justify-between items-center p-5 md:py-2 border-b-2 border-gray-300 " >
			<img src={Avatar} alt="avatar" className='lg:hidden' onClick={handleNavOpen}/>
			<h1 className="text-xl text-center w-full md:text-3xl">{title}</h1>

			{/* <form action="" onSubmit={handleSubmit} className="md:flex sm:block hidden relative"> */}
				<input
					type="text"
					placeholder="Search"
					name="search"
					value={search}
					className="rounded-2xl border-gray-300 border-2 p-1 w-[20em] sm:w-[20em] md:w-72 pl-10"
					onChange={handleSearchChange}
				/>
				<FaMagnifyingGlass className="absolute top-[0.7em] sm:[left-2em] left-2 flex self-center justify-center" />
			{/* </form> */}
				<button onClick={handleSearch}> <a href={`http://localhost:3000/search?key=${search}`}> search </a></button>
		</div>
	);
};

export default HeaderComponent;
