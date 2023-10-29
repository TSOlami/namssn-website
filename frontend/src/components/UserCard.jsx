import { Link } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { ProfileImg } from "../assets";

const UserCard = ({name, u_id, isVerified, username, avatar}) => {
    return (
        <div className="flex flex-row gap-2 lg:gap-2 items-center w-full relative">
            <div>
                <Link to={`/profile/${u_id}`}>
                    <img src={avatar || ProfileImg} alt="avatar" className="profile-image-small" />
                </Link>
            </div>
            <Link to={`/profile/${u_id}`}>
                {" "}
                {/* Wrap the user's name in a Link */}
                <span className="font-medium flex flex-row items-center gap-2">
                    <span className="font-semibold">{name}</span>
                    {isVerified && <FaCircleCheck color="#17A1FA" />}
                </span>
            </Link>
            <span>@{username}</span>
        </div>
    )
}
export default UserCard;