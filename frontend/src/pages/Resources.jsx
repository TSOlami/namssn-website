import { useEffect, useState } from "react";
import { HeaderComponent, AnnouncementContainer, FileForm } from "../components";
import { Sidebar } from "../components";
import { ResourceCard } from "../components";
import Upload from "../assets/Upload.png";
import axios from "axios";

const base_url = 'http://localhost:5000/api/v1/users/resources/'

const Resources = () => {
    const [data, setData] = useState(null);
    const [isPopUpVisible, setPopUpVisible] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/v1/users/resources")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handlePopUpOpen = () => {
        setPopUpVisible(true);
    };

    const handlePopUpClose = () => {
        setPopUpVisible(false);
    };

    if (data && Object.keys(data.files).length !== 0) {
        const urlList = Object.values(data);
        console.log(data.files)
        return (
            <div>
                <div className="flex">
                    <Sidebar />
                    <div className="lg:w-[65%] sm:w-[100%]">
                        <HeaderComponent name="Resources" />
                        <div className="lg:pt-5 gap:4 w-[100%]">
                            <span className="px-4 pb-4 font-bold font-crimson text-xl">YEAR 1 FIRST SEMESTER</span>
                            <div  className="px-4 flex flex-wrap gap-4 justify-items-start">
                                {data.files.map((file, index) => (
                                    <ResourceCard key={index} fileUrl={base_url + file} />
                                ))}
                            </div>
                            <button onClick={handlePopUpOpen} className="fring-4 fixed bottom-4 right-4 md:right-8 lg:right-[30%] xl:right-[30%] z-10 bg-green-600 text-white py-2 px-4 rounded-full">
                                <img className="lg:w-[30px]" src={Upload} alt="Upload" />
                            </button>
                            <FileForm show={isPopUpVisible} onClose={handlePopUpClose} />
                        </div>
                    </div>
                    <div className="w-[35%] sm:hidden md: hidden lg:block">
                        <AnnouncementContainer />
                    </div>
                </div>
            </div>
        );
    }
    if(data && Object.keys(data.files).length === 0) {
        return(
            <div>No Files Uploaded Yet</div>
        )
    }
    return <div>Loading...</div>;
}

export default Resources;
