import { useState } from "react";
import {HeaderComponent, AnnouncementContainer, FileForm} from "../components"
import {Sidebar} from "../components";
import {ResourceCard} from "../components"
import Upload from "../assets/Upload.png";

const Resources = () => {
    const [isPopUpVisible, setPopUpVisible] = useState(false)

    const handlePopUpOpen = () => {
        setPopUpVisible(true);
    }
    const handlePopUpClose = () => {
        setPopUpVisible(false);
    }

    return (
        <div>
            <div className="flex">
                <Sidebar/>
                <div className="lg:w-[65%] sm:w-[100%]">
                    <HeaderComponent name="Resources"/>
                    <div className="lg:pt-5 gap:4 w-[100%]">
                        <span className="px-4 pb-4 font-bold font-crimson text-xl">YEAR 1 FIRST SEMESTER</span>
                        <div className="px-4 flex flex-wrap gap-4 justify-items-start">
                            <ResourceCard course="Mathematics"/>
                            <ResourceCard course="English"/>
                            <ResourceCard course="Physics"/>     
                        </div>
                        <button onClick={handlePopUpOpen} className="fring-4 fixed bottom-4 right-4 md:right-8 lg:right-[30%] xl:right-[30%] z-10 bg-green-600 text-white py-2 px-4 rounded-full">
                            <img className="lg:w-[30px]" src={Upload}/>
                        </button>
                        <FileForm show={isPopUpVisible} onClose={handlePopUpClose} />
                    </div>
                </div>
                <div className="w-[35%] sm:hidden md: hidden lg:block"> 
                    <AnnouncementContainer/>
                </div>
            </div>
        </div>
    );
}

export default Resources;