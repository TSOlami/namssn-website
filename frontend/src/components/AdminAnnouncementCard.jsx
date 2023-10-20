import { AiFillCaretRight } from "react-icons/ai";

const AdminAnnouncementCard = ({ title, onClick }) => {
	return (
		<div 
		className="text-black bg-greyish flex gap-2 rounded-lg p-2 px-4 m-4 items-center cursor-pointer hover:border-l-4 hover:ml-2 hover:border-primary hover:rounded-l-none"
		onClick={onClick}>

			<div className="text-lg text-black">{title}</div>

			<div className="pl-5 ml-auto">
				<AiFillCaretRight />
			</div>
		</div>
	);
};

export default AdminAnnouncementCard;
