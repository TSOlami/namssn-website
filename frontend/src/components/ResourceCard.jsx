import {FaGraduationCap} from "react-icons/fa6";
import CerHat from "../assets/CerHat.png";

const cardClass = "font-crimson flex flex-col justify-center items-center rounded-[10px] bg-blue-300 p-2 h-20 w-20 text-xs center"

const ResourceCard = ({course, fileUrl}) => {
    const viewFile = (fileUrl) => {
        // Use the URL generated by your Express server
        // const fileUrl = URL.createObjectURL(data);
    
        // Open the file URL in a new tab/window
        console.log(fileUrl)
        const w = window.open();
        w.location = fileUrl;
    };
    return (
        <div className={cardClass} onClick={() => viewFile(fileUrl)}>
            <img src={CerHat}/>
            <span>{course}</span>
        </div>
    )
};

export default ResourceCard;