import {FaGraduationCap} from "react-icons/fa6";
import CerHat from "../assets/CerHat.png";
import axios from "axios";
import store from "../redux/store/store";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useState } from "react";

const state = store.getState();
const userInfo = state.auth.userInfo;

const cardClass = "font-crimson cursor-pointer md:hover:w-[6.2em] md:hover:h-[6.2em] lg:hover:w-[7em] lg:hover:h-[7em] hover:drop-shadow-xl flex flex-col justify-center items-center rounded-[10px] bg-blue-300 p-2 sm:w-15 sm:w-15 md:w-[6em] md:h-[6em] lg:h-20 lg:w-20 text-xs center"

const ResourceCard = ({uploaderUsername, title, course, fileUrl, description, semester, date}) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const viewFile = (fileUrl) => {
        // Use the URL generated by your Express server
        // const fileUrl = URL.createObjectURL(data);
    
        // Open the file URL in a new tab/window
        console.log(fileUrl)
        const w = window.open();
        w.location = fileUrl;
    };

    const handleFileDelete = async (fileUrl) => {
        setIsLoading(true);
        await axios.delete(fileUrl, {data: {_id: userInfo._id}})
        .then ((res) => {
            console.log(res);
            if (res.data === "Access Approved") {
                console.log(200)
                toast.success("File Successfully Deleted!");
                window.location.reload();
            } else if (res.data === "Access Denied") {
                console.log(400)
                toast.error("You are not priviledged to delete this file");
                setIsLoading(false)
            }
        }) .catch ((err) => {
            toast.error("An error occurred. Unable to delete resource");
        });
    }

    const smStyle = "text-xs text-gray-400";
    const lgStyle = "font-crimson text-sm text-blue-600"

    return (
        <div className="w-[10em] flex flex-col items-center">
            <span className="text-xs cursor-pointer hover:text-[0.8em] border rounded-sm border-blue-800 text-red-800" onClick={() => handleFileDelete(fileUrl)}>delete</span>
            <div className={cardClass} onClick={() => viewFile(fileUrl)}>
                <img src={CerHat}/>
                <span>{title}</span>
            </div>
            <div className="flex flex-col items-center border border-b-blue-800">
                <span className={lgStyle}>{description}</span>
                <div><span className={smStyle}>category: </span><span className={lgStyle}>{semester}</span></div>
                <div><span className={smStyle}>course: </span><span className={lgStyle}>{course}</span></div>
                <div><span className={smStyle}>By: </span> <span className={lgStyle}>{uploaderUsername}</span></div>
                <div><span className={smStyle}>Date Uploaded: </span><span className={lgStyle}>{date}</span></div>
            </div>
            {isLoading && <Loader />}
        </div>
    )
};

export default ResourceCard;