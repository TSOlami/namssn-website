import { Link } from "react-router-dom";
import {
	FaHouse,
	FaBell,
	FaGraduationCap,
	FaMoneyBill,
	FaPerson,
	FaArrowRightFromBracket,
	FaCircleCheck,
} from "react-icons/fa6";
import { useEffect, useState } from "react";
import {Avatar} from "../../assets";
import { RiUserSettingsLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useLogoutMutation } from "../../redux";
import { logout } from "../../redux/slices/authSlice";

const Sidebar = () => {
	const { userInfo } = useSelector((state) => state.auth);

   // Fetch user info from redux store
   const name = userInfo?.name;
   const username = userInfo?.username;
   const isVerified = userInfo?.isVerified;
 
 
   // Check if user is admin
   // const isAdmin = userInfo?.isAdmin;
 
  // Check if user is admin
  const isAdmin = userInfo?.role === 'admin';

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

	const [isNavOpen, setIsNavOpen] = useState(false);
	const handleNavOpen = () => {
		setIsNavOpen(!isNavOpen);
	};

	useEffect(() => {
		const hamburger = document.querySelector(".hamburger");

		hamburger.addEventListener("click", handleNavOpen);

		return () => {
			hamburger.removeEventListener("click", handleNavOpen);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isNavOpen]);

	return (
		<>
			{/* Fixed empty block element to prevent sidebar from collapsing */}
			<div className="z-0 h-full min-w-[250px] hidden lg:block"></div>

			{/* hamburger for mobile view */}
			{/* Tailwind is stressful guyyyy, I wrote it with vanilla css in the index.css file */}
			
			{/* <div onClick={handleNavOpen} className={isNavOpen ? "hamburger block md:hidden fixed right-[1rem] top-[0] z-10" : "hamburger block md:hidden fixed right-[1rem] top-[4vh] z-10"}>
				<span className="block w-[33px] h-[4px] my-[6px] mx-auto bg-primary transition-all duration-300"></span>
				<span className="bg-secondary block w-[33px] h-[4px] my-[6px] mx-auto bg-primary transition-all duration-300 "></span>
				<span className="bg-secondary block w-[33px] h-[4px] my-[6px] mx-auto bg-primary transition-all duration-300"></span>
			</div> */}

			<div className={isNavOpen ? "hamburger active" : "hamburger"}>
				<span className="bar side"></span>
				<span className="bar side"></span>
				<span className="bar side"></span>
			</div>

			<div className={isNavOpen? "bg-greyish h-screen lg:flex flex-col gap-20 p-5 min-w-[250px] fixed left-[0%] lg:left-0 z-30 transition-all duration-300" : "bg-greyish h-screen lg:flex flex-col gap-20 p-5 min-w-[250px] fixed left-[-105%] lg:left-0 transition-all duration-300"}>
				{/* profile info */}
				<div className="pb-8 flex gap-2">
					<div>
						<img src={Avatar} alt="" />
					</div>
					<div className="flex flex-col text-sm">
						<span className="font-semibold flex flex-row items-center gap-2">
							{name}
							{isVerified && <FaCircleCheck color="#17A1FA" />}
						</span>
						<span>@{username}</span>
					</div>
				</div>

				{/* sidebar nav */}
				<div>
					<ul className="text-lg flex flex-col gap-5">
						<li>
							<Link
								to="/home"
								className="transition duration-500 flex flex-row gap-3 items-center hover:bg-primary hover:text-white p-2 rounded-lg"
							>
								<FaHouse />
								<span>Home</span>
							</Link>
						</li>

						<li>
							<Link
								to="/notifications"
								className="transition duration-500 flex flex-row gap-3 items-center hover:bg-primary hover:text-white p-2 rounded-lg"
							>
								<FaBell />
								<span>Notifications</span>
							</Link>
						</li>
						<li>
							<Link
								to="/resources"
								className="transition duration-500 flex flex-row gap-3 items-center hover:bg-primary hover:text-white p-2 rounded-lg"
							>
								<FaGraduationCap />
								<span>Learning Resources</span>
							</Link>
						</li>
						<li>
							<Link
								to="/payments"
								className="transition duration-500 flex flex-row gap-3 items-center hover:bg-primary hover:text-white p-2 rounded-lg"
							>
								<FaMoneyBill />
								<span>Payment</span>
							</Link>
						</li>
						<li>
							<Link
								to="/profile"
								className="transition duration-500 flex flex-row gap-3 items-center hover:bg-primary hover:text-white p-2 rounded-lg"
							>
								<FaPerson />
								<span>Profile</span>
							</Link>
						</li>
						{ isAdmin && (
							<li>
							<Link
								to="/admin"
								className="transition duration-500 flex flex-row gap-3 items-center hover:bg-primary hover:text-white p-2 rounded-lg"
							>
								<RiUserSettingsLine />
								<span>Admin Dashboard</span>
							</Link>
						</li>
						)}
					</ul>
				</div>

				{/* Log-out */}

				<div className="pt-10">
					<Link
						to="/"
            onClick={ logoutHandler }
						className="transition duration-500 text-red-500 flex flex-row gap-3 items-center hover:bg-red-500 hover:text-white p-2 rounded-lg"
					>
						<FaArrowRightFromBracket /> Log Out
					</Link>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
