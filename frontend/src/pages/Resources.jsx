import { useEffect, useState } from "react";
import {
	HeaderComponent,
	AnnouncementContainer,
	FileForm,
} from "../components";
import { Sidebar } from "../components";
import { ResourceCard } from "../components";
import { Upload } from "../assets";
import { FaMagnifyingGlass } from "react-icons/fa6";
import store from "../redux/store/store";
import { motion } from "framer-motion";
import { formatDateToTime } from "../utils";
import axios from "axios";
import { PiPlaceholder } from "react-icons/pi";
import Loader from '../components/Loader'
import { IoContractOutline } from "react-icons/io5";

const base_url = "http://localhost:5000/api/v1/users/resources/";

const state = store.getState();
const userInfo = state.auth.userInfo;
// console.log(userInfo)
const levelStyle = "w-[100%]  h-8 flex rounded-lg items-center shadow-lg ring-2 bg-gray-900";
// console.log(`================ ${userInfo} ================`)
const isSubDictPresent = (mainDict, subDict) => {
    for (const [key, value] of Object.entries(subDict)) {
        if (mainDict[key] !== value) {
          return false;
        }
      }
      return true;
}

const Resources = () => {
    // localStorage.removeItem("filesDetails")
    // try {
    //  const res = axios.get('http://127.0.0.1:5000/api/v1/users/resources')
    //     if (res) {
    //         var tempData = res.data   
    //     } else {
    //         tempData = {}
    //     }
    //     var tempData2 = [...Object.values(tempData)]
    //     tempData2 = tempData2.flat()
    // }
    // console.log("++++++++++++", tempData2)
    // console.log(tempData)
    const [data, setData] = useState(null);
    const [isPopUpVisible, setPopUpVisible] = useState(false);
    const handleReload = () => {
        window.location.reload();
    }
    // const newData = [];

    const [selectedOption, setSelectedOption] = useState('title');
    const isLoading = true;

    useEffect(() => {
    }, [selectedOption]);

    const [value, setValue] = useState("")

    const handleSearch = (e) => {
        setValue(e.target.value)
    }
    const handlePopUpOpen = () => {
        setPopUpVisible(true);
    };

    const handlePopUpClose = () => {
        setPopUpVisible(false);
    };

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/users/resources');
                if (res) {
                    console.log(res);
                    setData(res.data); // set the fetched data to the state
                }
            } catch (err) {
                setData("error")
                console.log(err);
            }
        };
        fetchData(); // call the fetchData function
    }, []);

    if (data === null) {
        return (
        <div className="w-[100%] flex justify-between">
            <Sidebar/>
            {/* <div className="text-xl font-crimson text-gray-300 w-[100%] fixed left-[40%] font-medium top-[40%]">
                Fetching...
            </div> */}
            <div className="w-[27%] sm:hidden md:block hidden lg:block">
                <AnnouncementContainer />
            </div>
            {isLoading && <Loader />}
        </div>
        )
    } else if(data && data.length !== 0 && data !== "error") {
            console.log(data)
            const level1FileList = data['100 Level'] ? data['100 Level'].map(obj => Object.keys(obj)[0]) : null;
            const level2FileList = data['200 Level'] ? data['200 Level'].map(obj => Object.keys(obj)[0]) : null;
            const level3FileList = data['300 Level'] ? data['300 Level'].map(obj => Object.keys(obj)[0]) : null;
            const level4FileList = data['400 Level'] ? data['400 Level'].map(obj => Object.keys(obj)[0]) : null;
            const level5FileList = data['500 Level'] ? data['500 Level'].map(obj => Object.keys(obj)[0]) : null;
       
            // console.log(`============${data}============`)
            // const fileList2 = data.map(obj => Object.keys(obj)[0])
            return (
                <div className="relative">
                    <div className="flex relative z-2">
                        <Sidebar/>
                        <div className={isPopUpVisible ? "blur-[2px] pointer-events-none lg:w-[65%] sm:w-[100%]" : "lg:w-[65%] sm:w-[100%] block"}>
                            <div className="sticky top-[0.01%] z-[300] bg-white w-[100%]">
                                <HeaderComponent title="RESOURCES" url={"Placeholder"}/>
                            </div>
                            <div className="lg:pt-5 gap:4 w-[100%]">
                                {level1FileList && (<div className="px-4 pt-6 pb-4 flex items-center flex-col">
                                <div className={levelStyle}>
                                    <span className="font-bold pl-4 absolute left-4 lg:left-[14em] font-crimson sm:text-xl text-white text-sm">100 Level</span>
                                </div>
                                    <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                                        {level1FileList.map((file, index) => ( 
                                            <ResourceCard key={index} fileUrl={base_url + file} description={data['100 Level'][index][file]['description']}
                                            uploaderUsername = {data['100 Level'][index][file]['uploaderUsername']}
                                            title = {data['100 Level'][index][file]['title']}
                                            date = {formatDateToTime(new Date(data['100 Level'][index][file]['date']))}
                                            semester = {data['100 Level'][index][file]['semester']}
                                            course = {data['100 Level'][index][file]['course']}
                                            />
                                        ))}
                                    </div>
                                    {level1FileList.length > 4 && (<a href="http://localhost:3000/resources/100%20Level"><button className="w-[100%] bg-green-600 hover:bg-green-900 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button></a>)}
                                </div>)}
                                {level2FileList && (<div className="px-4 pt-6 pb-4 flex items-center flex-col">
                                <div className={levelStyle}>
                                    <span className="font-bold pl-4 font-crimson absolute left-4 lg:left-[14em] sm:text-xl text-white text-sm">200 Level</span>
                                </div>
                                    <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                                        {level2FileList.map((file, index) => ( 
                                            <ResourceCard key={index} fileUrl={base_url + file} description={data['200 Level'][index][file]['description']}
                                            uploaderUsername = {data['200 Level'][index][file]['uploaderUsername']}
                                            title = {data['200 Level'][index][file]['title']}
                                            date = {formatDateToTime(new Date(data['200 Level'][index][file]['date']))}
                                            semester = {data['200 Level'][index][file]['semester']}
                                            course = {data['200 Level'][index][file]['course']}
                                            />
                                        ))}
                                    </div>
                                    {level2FileList.length > 4 && (<a href="http://localhost:3000/resources/200%20Level"><button className="w-[100%] bg-green-600 hover:bg-green-900 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button></a>)}
                                </div>)}
                                {level3FileList && (<div className="px-4 pt-6 pb-4 flex items-center flex-col">
                                <div className={levelStyle}>
                                    <span className="font-bold pl-4 font-crimson absolute left-4 lg:left-[14em] sm:text-xl text-white text-sm">300 Level</span>
                                </div>
                                    <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                                        {level3FileList.map((file, index) => ( 
                                            <ResourceCard  key={index} fileUrl={base_url + file} description={data['300 Level'][index][file]['description']}
                                            uploaderUsername = {data['300 Level'][index][file]['uploaderUsername']}
                                            title = {data['300 Level'][index][file]['title']}
                                            date = {formatDateToTime(new Date(data['300 Level'][index][file]['date']))}
                                            semester = {data['300 Level'][index][file]['semester']}
                                            course = {data['300 Level'][index][file]['course']}
                                            />
                                        ))}
                                    </div>
                                    {level3FileList.length > 4 && (<a href="http://localhost:3000/resources/300%20Level"><button className="w-[100%] bg-green-600 hover:bg-green-900 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button></a>)}
                                </div>)}
                                {level4FileList && (<div className="px-4 pt-6 pb-4 flex items-center flex-col">
                                <div className={levelStyle}>    
                                    <span className="font-bold pl-4 font-crimson absolute left-4 lg:left-[14em] sm:text-xl text-white text-sm">400 Level</span>
                                </div>
                                    <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                                        {level4FileList.map((file, index) => ( 
                                            <ResourceCard key={index} fileUrl={base_url + file} description={data['400 Level'][index][file]['description']}
                                            uploaderUsername = {data['400 Level'][index][file]['uploaderUsername']}
                                            title = {data['400 Level'][index][file]['title']}
                                            date = {formatDateToTime(new Date(data['400 Level'][index][file]['date']))}
                                            semester = {data['400 Level'][index][file]['semester']}
                                            course = {data['400 Level'][index][file]['course']}
                                            />
                                        ))}
                                    </div>
                                        {level4FileList.length > 4 && (<a href="http://localhost:3000/resources/400%20Level"><button className="w-[100%] bg-green-600 hover:bg-green-900 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button></a>)}
                                </div>)}
                                {level5FileList && (<div className="px-4 pt-6 pb-4 flex items-center flex-col">
                                <div className={levelStyle}>
                                    <span className="font-bold pl-4 absolute left-4 lg:left-[14em] font-crimson sm:text-xl text-white text-sm">500 Level</span>
                                </div>
                                    <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                                        {level5FileList.map((file, index) => ( 
                                            <ResourceCard key={index} fileUrl={base_url + file} description={data['500 Level'][index][file]['description']}
                                            uploaderUsername = {data['500 Level'][index][file]['uploaderUsername']}
                                            title = {data['500 Level'][index][file]['title']}
                                            date = {formatDateToTime(new Date(data['500 Level'][index][file]['date']))}
                                            semester = {data['500 Level'][index][file]['semester']}
                                            course = {data['500 Level'][index][file]['course']}
                                            />
                                        ))}
                                    </div>
                                    {level5FileList.length > 4 && (<a href="http://localhost:3000/resources/500%20Level"><button className="w-[100%] bg-green-600 hover:bg-green-900 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button></a>)}
                                </div>)}
                            </div> 
                            <button onClick={handlePopUpOpen} className="drop-shadow-2xl ring-2 hover:ring-4 fring-4 fixed bottom-4 right-4 md:right-[18em] lg:right-[30%] xl:right-[30%] z-10 bg-green-600 text-white py-2 px-4 rounded-full">
                                <img className="lg:w-[30px]" src={Upload} alt="Upload" />
                            </button>
                            
                        </div>
                        <div className={isPopUpVisible ? "blur-[2px] pointer-events-none w-[35%] sm:hidden md:hidden hidden lg:block": "w-[35%] sm:hidden md:hidden hidden lg:block"}>
                            <AnnouncementContainer />
                        </div>
                    </div>
                    <div className="fixed z-1 bottom-[10em] left-[10em] md:left-[15em] lg:left-[20em] w-[60%]">
                        <FileForm name={userInfo.name} userId={userInfo._id} show={isPopUpVisible} onClose={handlePopUpClose} />
                    </div>
                </div>  
            );
        } else if(data && data.length===0) {
            return (
            <div className="flex">
                <Sidebar/>
                <div className="text-xl font-crimson text-gray-300 w-[100%] fixed left-[40%] font-medium top-[40%]">
                    No file uploaded yet
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
                        <FileForm name={userInfo.name} userId={userInfo._id} show={isPopUpVisible} onClose={handlePopUpClose} />
                </div>
            </div>
        )
    } else if (data==="error") {
        console.log("ERROR")
        return (
            <div className="lg:flex lg:justify-between">
                <Sidebar/>
                <div className="text-xl flex flex-col items-center font-crimson text-gray-500 w-[100%] fixed right-[3%] font-medium top-[40%]">
                    <div><span>Unable to fetch resources.</span></div>
                    <div><span>Click <span onClick={handleReload} className="text-green-500 cursor-pointer  hover:text-green-300">here</span> to reload.</span></div>
                </div>
                <div className="w-[27%] sm:hidden md:hidden hidden lg:block">
                    <AnnouncementContainer />
                </div>
            </div>
        )
    }
}

    export default Resources;