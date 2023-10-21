import CerHat from "../assets/CerHat.png";
import axios from "axios";
import store from "../redux/store/store";
import { toast } from "react-toastify";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useEffect, useRef } from "react";

const state = store.getState();
const userInfo = state.auth.userInfo;
const isAdmin = userInfo?.role;

const cardClass =
	"cursor-pointer hover:drop-shadow-xl flex flex-col justify-center items-center rounded-[10px] bg-cardbg p-2 sm:w-15 h-[150px] w-[150px]";

const ResourceCard = ({
	uploaderUsername,
	title,
	course,
	fileUrl,
	description,
	semester,
	date,
}) => {
	// manage state for the delete options button
	const [openOptions, setOpenOptions] = useState(false);
	const handleSetOpenOptions = () => {
		setOpenOptions(!openOptions);
	};

	const [showDetails, setShowDetails] = useState(false);
	const handleSetShowDetails = (e) => {
		e.stopPropagation();
		setShowDetails(!showDetails);
	};

	// controls clickaway action for 3 dots options
	const buttonRef = useRef(null);
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				buttonRef.current &&
				!buttonRef.current.contains(event.target)
			) {
				setOpenOptions(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const viewFile = (fileUrl) => {
		// Use the URL generated by your Express server
		// const fileUrl = URL.createObjectURL(data);

		// Open the file URL in a new tab/window
		console.log(fileUrl);
		const w = window.open();
		w.location = fileUrl;
	};

	const handleFileDelete = async (fileUrl) => {
		handleSetOpenOptions();
		await axios
			.delete(fileUrl, { data: { _id: userInfo._id } })
			.then((res) => {
				console.log(res);
				if (res.data === "Access Approved") {
					console.log(200);
					toast.success("File Successfully Deleted!");
					window.location.reload();
				} else if (res.data === "Access Denied") {
					console.log(400);
					toast.error("You are not priviledged to delete this file");
				}
			})
			.catch(() => {
				toast.error("An error occurred. Unable to delete resource");
			});
	};

	const handleNewDelete = (e) => {
		e.stopPropagation();
		handleFileDelete(fileUrl);
	};

	const smStyle = "text-sm text-gray-400";
	const lgStyle = "text-sm text-blue-600";

	return (
		<div className="w-[10em] flex flex-col justify-start items-center my-2">
			<div
				className={cardClass + " relative"}
				onClick={() => viewFile(fileUrl)}
			>
				<img src={CerHat} />
				<span className="pb-2 texhth">{title}</span>
				<span
					onClick={(event) => {
						event.stopPropagation();
						handleSetOpenOptions();
					}}
					className="absolute right-0 top-0 z-[200] p-3"
				>
					<HiDotsVertical />
				</span>

				<div ref={buttonRef}>
					{openOptions && (
						<div>
							{isAdmin === "admin" && (
								<button
									onClick={handleNewDelete}
									className="text-red-500 p-2 absolute bg-white right-3 top-2 flex items-center gap-2 shadow-lg z-[201] hover:border border-black"
								>
									<MdDelete /> <span>Delete Post</span>
								</button>
							)}

							<div
								onClick={handleSetShowDetails}
								className="bg-white p-2 absolute right-3 top-[50px] flex items-center shadow-lg w-[120px] hover:border border-black z-[201]"
							>
								Details
							</div>
						</div>
					)}
				</div>

				
			</div>
			{showDetails && (
					<div className="flex flex-col pl-2 border border-b-blue-800 bg-white">
						<span className={lgStyle}>{description}</span>
						<div>
							<span className={smStyle}>category: </span>
							<span className={lgStyle}>{semester}</span>
						</div>
						<div>
							<span className={smStyle}>course: </span>
							<span className={lgStyle}>{course}</span>
						</div>
						<div>
							<span className={smStyle}>By: </span>{" "}
							<span className={lgStyle}>{uploaderUsername}</span>
						</div>
						<div>
							<span className={smStyle}>Date Uploaded: </span>
							<span className={lgStyle}>{date}</span>
						</div>
					</div>
				)}
		</div>
	);
};

export default ResourceCard;
