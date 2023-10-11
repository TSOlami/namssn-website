import {FaGraduationCap} from "react-icons/fa6";
import CerHat from "../assets/CerHat.png";

const cardClass = "font-crimson flex flex-col justify-center items-center rounded-[10px] bg-blue-300 p-2 h-20 w-20 text-xs center"

const ResourceCard = ({course}) => {
    return (
        <div className={cardClass}>
            <img src={CerHat}/>
            <span>{course}</span>
        </div>
    )
};

export default ResourceCard;