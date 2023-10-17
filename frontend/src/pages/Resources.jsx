import { useEffect, useState } from "react";
import { HeaderComponent, AnnouncementContainer, FileForm } from "../components";
import { Sidebar } from "../components";
import { ResourceCard } from "../components";
import { Upload }from '../assets';
import axios from "axios";
import { FaMagnifyingGlass } from "react-icons/fa6";
import store from "../redux/store/store";

const base_url = 'http://localhost:5000/api/v1/users/resources/'

const state = store.getState();
const userInfo = state.auth.userInfo;
// console.log(`================ ${userInfo._id} ================`)

const Resources = () => {
    const [data, setData] = useState(null);
    const [isPopUpVisible, setPopUpVisible] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/v1/users/resources")
            .then((res) => {
                // console.log(res.data.files[0])
                setData(res.data.files);
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

    
        
        if (data && data.length !== 0) {
            const fileList = data.map(obj => Object.keys(obj)[0]);
            console.log(data)
            return (
                <div className="relative">
                    <div className="flex relative z-2">
                        <Sidebar/>
                        <div className={isPopUpVisible ? "blur-[2px] pointer-events-none lg:w-[65%] sm:w-[100%]" : "lg:w-[65%] sm:w-[100%] block"}>
                            <HeaderComponent name="Resources" />
                            <div className="lg:pt-5 gap:4 w-[100%]">
                                <div className="mb-4">
                                    <span className="px-4 pb-4  font-bold font-crimson text-blue-900 text-xl">RESOURCES</span>
                                </div>
                                <div className="sticky shadow-lg opacity-[100%] border-2 pl-4 pr-4 top-[2%] left-[38%] border-gray-300 rounded-xl w-[45%]">
                                    <FaMagnifyingGlass className="absolute top-1 left-2 flex self-center justify-center" />
                                    <input
                                        type='input' placeholder="Search here"
                                        className="ml-5 outline-none"
                                    />
                                </div>
                                <div  className="px-4 pt-12 flex flex-wrap gap-4 justify-items-start">
                                    {fileList.map((file, index) => (
                                        <ResourceCard key={index} fileUrl={base_url + file} description={data[index][file]['description']}
                                        uploaderUsername = {data[index][file]['uploaderUsername']}
                                        title = {data[index][file]['title']}
                                        date = {data[index][file]['date']}
                                        semester = {data[index][file]['semester']}
                                        course = {data[index][file]['course']}
                                        />
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
                <div className="text-xl font-crimson w-[100%] fixed left-[43%] font-medium top-[40%]">
                    Fetching files....
                </div>
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
