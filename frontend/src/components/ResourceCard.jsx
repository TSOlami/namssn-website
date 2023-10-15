import {FaGraduationCap} from "react-icons/fa6";
import CerHat from "../assets/CerHat.png";

const cardClass = "font-crimson md:hover:w-[6.2em] md:hover:h-[6.2em] lg:hover:w-[7em] lg:hover:h-[7em] hover:drop-shadow-xl flex flex-col justify-center items-center rounded-[10px] bg-blue-300 p-2 sm:w-15 sm:w-15 md:w-[6em] md:h-[6em] lg:h-20 lg:w-20 text-xs center"

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