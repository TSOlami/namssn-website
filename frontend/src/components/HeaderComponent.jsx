import { useState } from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";
import "../index.css"
const style = {
    width: '100',
    height: '100%',
    fontFamily: "Crimson Text",
    marginLeft: "2%",
    marginRight: "2%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
}


const HeaderComponent = (props) => {
    const [searchText, setSearchText] = useState('');
    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    }
    return (
        // <div style={{borderBottom: "1px solid #B3B3B3", height: "10%", width: "50.5em"}}>
		<div className="py-4 px-200 border-b-2 border-solid border-gray-300">
                <div className="flex justify-between px-2">
					<span className="font-crimson font-bold lg:text-3xl sm:text-sm">  {props.name} </span>
					<div className="search">
						<FaMagnifyingGlass className='pl-2 w-8' />
						<input className="text-black font-crimson outline-none pl-4" type="text" placeholder="Search" value={searchText} onChange={handleInputChange} />
					</div>
				</div>
        </div>
    );
};



// import { FaMagnifyingGlass } from "react-icons/fa6";
// import { Avatar } from "../assets";
// import { useState } from "react";

// const HeaderComponent = ({ title }) => {
// 	const [search, setSearch] = useState("");
// 	const handleSearchChange = (e) => {
// 		e.preventDefault();
// 		setSearch(e.target.value);
// 	};
// 	const handleSubmit = (e) => {
// 		e.preventDefault();
// 		console.log(search);
// 		setSearch("");
// 	}

// 	return (
// 		<div className="flex flex-row md:justify-between items-center p-5 md:py-2 border-b-2 border-gray-300">
// 			<img src={Avatar} alt="avatar" className="md:hidden" />

// 			<h1 className="text-xl text-center w-full md:text-3xl">{title}</h1>
// 			<form action="" onSubmit={handleSubmit} className="hidden md:flex  relative">
// 				<input
// 					type="text"
// 					placeholder="Search"
// 					name="search"
// 					value={search}
// 					className="rounded-2xl border-gray-300 border-2 p-1 w-56 md:w-72 pl-10"
// 					onChange={handleSearchChange}
// 				/>
// 				<FaMagnifyingGlass className="absolute left-2 flex self-center justify-center" />
// 			</form>
// 		</div>
// 	);
// };

export default HeaderComponent;
