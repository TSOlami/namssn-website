import { useEffect, useState } from "react";
import { HeaderComponent, AnnouncementContainer, FileForm } from "../components";
import { Sidebar } from "../components";
import { ResourceCard } from "../components";
import Upload from "../assets/Upload.png";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { initialState } from "../redux/slices/authSlice"
import store from "../redux/store/store";

const base_url = 'http://localhost:5000/api/v1/users/resources/'

const state = store.getState();
const userInfo = state.auth.userInfo;
console.log(userInfo)

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

    
        
        if (data && Object.keys(data).length !== 0) {
            const fileList = Object.keys(data)
            return (
                <div className="relative">
                    <div className="flex relative z-2">
                        <Sidebar/>
                        <div className={isPopUpVisible ? "blur-[2px] pointer-events-none lg:w-[65%] sm:w-[100%]" : "lg:w-[65%] sm:w-[100%] block"}>
                            <HeaderComponent name="Resources" />
                            <div className="lg:pt-5 gap:4 w-[100%]">
                                <span className="px-4 pb-4 font-bold font-crimson text-xl">YEAR 1 FIRST SEMESTER</span>
                                <div  className="px-4 flex flex-wrap gap-4 justify-items-start">
                                    {fileList.map((file, index) => (
                                        <ResourceCard key={index} fileUrl={base_url + file} />
                                    ))}
                                </div>
                            </div>
                            <button onClick={handlePopUpOpen} className="drop-shadow-2xl ring-2 hover:ring-4 fring-4 fixed bottom-4 right-4 md:right-8 lg:right-[30%] xl:right-[30%] z-10 bg-green-600 text-white py-2 px-4 rounded-full">
                                <img className="lg:w-[30px]" src={Upload} alt="Upload" />
                            </button>
                            
                        </div>
                        <div className={isPopUpVisible ? "blur-[2px] pointer-events-none w-[35%] sm:hidden md:block hidden lg:block": "w-[35%] sm:hidden md:block hidden lg:block"}>
                            <AnnouncementContainer />
                        </div>
                    </div>
                    <div className="fixed z-1 bottom-[10em] left-[20em] w-[60%]">
                        <FileForm userId={userInfo._id} show={isPopUpVisible} onClose={handlePopUpClose} />
                    </div>
                </div>   
            );
        } else {
            return (
            <div className="flex">
                <Sidebar/>
                <div className={isPopUpVisible ? "blur-[2px] pointer-events-none lg:w-[65%] sm:w-[100%]" : "lg:w-[65%] sm:w-[100%] block"}>
                    <button onClick={handlePopUpOpen} className="drop-shadow-2xl ring-2 hover:ring-4 fring-4 fixed left-[45%] top-[45%] z-10 bg-green-600 text-white py-2 px-4 rounded-full">
                        <img className="lg:w-[30px]" src={Upload} alt="Upload" />
                    </button>
                </div>
                <div className={isPopUpVisible ? "blur-[2px] pointer-events-none w-[35%] sm:hidden md:block hidden lg:block": "w-[35%] sm:hidden md:block hidden lg:block"}>
                    <AnnouncementContainer />
                </div>
                <div className="fixed z-1 bottom-[10em] left-[20em] w-[60%]">
                        <FileForm show={isPopUpVisible} onClose={handlePopUpClose} />
                </div>
            </div>
        )
        }

    // if(data && Object.keys(data.files).length === 0) {
    //     return(
    //         <div>No Files Uploaded Yet</div>
    //     )
    // }
    // return(
    // <div className="flex">
    //     <span> No Files Uploaded Yet </span>

    // </div>
    // );
}

export default Resources;
