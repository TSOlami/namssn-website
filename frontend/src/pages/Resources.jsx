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

const base_url = "http://localhost:5000/api/v1/users/resources/";

const state = store.getState();
const userInfo = state.auth.userInfo;
const levelStyle = "w-[100%] h-8 flex rounded-lg items-center shadow-lg ring-2 bg-gray-900";
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
    var tempData = JSON.parse(localStorage.getItem("filesDetails"));
    var tempData2 = [...Object.values(tempData)]
    tempData2 = tempData2.flat()
    // console.log("++++++++++++", tempData2)
    // console.log(tempData)
    const [data, setData] = useState(tempData);
    const [isPopUpVisible, setPopUpVisible] = useState(false);
    const handleReload = () => {
        window.location.reload();
    }

    // const newData = [];

    const [selectedOption, setSelectedOption] = useState('title');
    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
        };
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
        // console.log(value)
        if (value === "" && tempData) {
            setData(tempData)
        } else if (selectedOption) {
            if (tempData && tempData.length !== 0) {
                const myfileList = tempData2.map(obj => Object.keys(obj)[0]);
                const newData = {};
                myfileList.map((file, index) => {
                    if (tempData2[index][file][selectedOption].toLowerCase().includes(value.toLowerCase())) {
                        Object.keys(tempData).forEach((key) => {
                            for (let j=0; j<tempData[key].length; j++) {
                                if (isSubDictPresent(tempData[key][j], {[file]: tempData2[index][file]})) {
                                    console.log(file)
                                    if (Object.keys(newData).includes(key)) {
                                        newData[[key]].push({[file]: tempData2[index][file]})
                                    } else {
                                        newData[[key]] = [{[file]: tempData2[index][file]}]
                                    }
                                    console.log(newData)
                                }
                            }
                        })
                        setData(newData)
                    };
                });
            }
        }
        // console.log(data)

    }, [value]);
    if(data && data.length !== 0) {
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
                            <HeaderComponent title="RESOURCES"/>
                            <div className="lg:pt-5 gap:4 w-[100%]">
        
                                <div className="mb-4 flex justify-between">
                                    <span className="px-4 pb-4  font-bold font-crimson sm:text-xl text-blue-900 text-sm">RESOURCES</span>
                                    <div className="flex gap-2 mr-4">
                                        <span className="font-serif text-blue-900 text-[0.95em]">Filter: </span>
                                        <select value={selectedOption} onChange={handleSelectChange} name="dropdown" className="text-gray-300 block w-[55%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200 focus:outline-none">
                                            <option value="title" className="text-black font-crimson text-lg">Title</option>
                                            <option value="course" className="text-black font-crimson text-lg">Course</option>
                                            <option value="semester" className="text-black font-crimson text-lg">Level</option>
                                        </select>
                                    </div>
                                </div>
                              
                                <div className="sticky bg-white shadow-lg border-2 z-10 pl-4 pr-4 top-[2%] left-[33%] border-gray-300 rounded-xl w-[50%]">
                                    <div className="absolute  h-[100%] flex ">
                                    <FaMagnifyingGlass  className="mt-1"/>
                                    </div>
                                    <input
                                        type='input' placeholder="Search here"
                                        className="bg-opacity-[100%] ml-2 pl-3 outline-none w-[95%]"
                                        onChange={handleSearch}
                                    />
                                </div>
                                {level1FileList && (<div className="px-4 pt-6 pb-4 flex items-center flex-col">
                                <div className={levelStyle}>
                                    <span className="font-bold pl-4 absolute left-4 font-crimson sm:text-xl text-white text-sm">100 Level</span>
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
                                    {level1FileList.length > 4 && (<a href="http://localhost:3000/resources/100%20Level"><button className="w-[100%] bg-gray-600 hover:bg-gray-900 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button></a>)}
                                </div>)}
                                {level2FileList && (<div className="px-4 pt-6 pb-4 flex flex-col">
                                <div className={levelStyle}>
                                    <span className="font-bold pl-4 font-crimson absolute left-4 sm:text-xl text-white text-sm">200 Level</span>
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
                                    {level2FileList.length > 4 && (<a href="http://localhost:3000/resources/200%20Level"><button className="w-[100%] bg-gray-600 hover:bg-gray-900 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button></a>)}
                                </div>)}
                                {level3FileList && (<div className="px-4 pt-6 pb-4 flex flex-col">
                                <div className={levelStyle}>
                                    <span className="font-bold pl-4 font-crimson absolute left-4 sm:text-xl text-white text-sm">300 Level</span>
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
                                    {level3FileList.length > 4 && (<a href="http://localhost:3000/resources/300%20Level"><button className="w-[100%] bg-gray-600 hover:bg-gray-900 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button></a>)}
                                </div>)}
                                {level4FileList && (<div className="px-4 pt-6 pb-4 flex flex-col">
                                <div className={levelStyle}>    
                                    <span className="font-bold pl-4 font-crimson absolute left-4 sm:text-xl text-white text-sm">400 Level</span>
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
                                    {level4FileList.length > 4 && (<a href="http://localhost:3000/resources/400%20Level"><button className="w-[100%] bg-gray-600 hover:bg-gray-900 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button></a>)}
                                </div>)}
                                {level5FileList && (<div className="px-4 pt-6 pb-4 flex flex-col">
                                <div className={levelStyle}>
                                    <span className="font-bold pl-4 absolute left-4 font-crimson sm:text-xl text-white text-sm">500 Level</span>
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
                                    {level5FileList.length > 4 && (<a href="http://localhost:3000/resources/500%20Level"><button className="w-[100%] bg-gray-600 hover:bg-gray-900 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button></a>)}
                                </div>)}
                            </div> 
                            <button onClick={handlePopUpOpen} className="drop-shadow-2xl ring-2 hover:ring-4 fring-4 fixed bottom-4 right-4 md:right-[18em] lg:right-[30%] xl:right-[30%] z-10 bg-green-600 text-white py-2 px-4 rounded-full">
                                <img className="lg:w-[30px]" src={Upload} alt="Upload" />
                            </button>
                            
                        </div>
                        <div className={isPopUpVisible ? "blur-[2px] pointer-events-none w-[35%] sm:hidden md:block hidden lg:block": "w-[35%] sm:hidden md:block hidden lg:block"}>
                            <AnnouncementContainer />
                        </div>
                    </div>
                    <div className="fixed z-1 bottom-[10em] left-[10em] md:left-[15em] lg:left-[20em] w-[60%]">
                        <FileForm userId={userInfo._id} show={isPopUpVisible} onClose={handlePopUpClose} />
                    </div>
                </div>  
            );
        } else {
            console.log("here")
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
                        <FileForm userId={userInfo._id} show={isPopUpVisible} onClose={handlePopUpClose} />
                </div>
            </div>
        )
    }}

    export default Resources;