import { useEffect, useState } from "react";
import {
	HeaderComponent,
	AnnouncementContainer,
	FileForm,
} from "../components";
import { Sidebar } from "../components";
import { ResourceCard } from "../components";
import { Upload } from "../assets";
import axios from "axios";
import { FaMagnifyingGlass } from "react-icons/fa6";
import store from "../redux/store/store";
import { motion } from "framer-motion";

const base_url = "http://localhost:5000/api/v1/users/resources/";

const state = store.getState();
const userInfo = state.auth.userInfo;
// console.log(`================ ${userInfo} ================`)
const Resources = ({query}) => {
    // localStorage.removeItem("filesDetails")
    const tempData = JSON.parse(localStorage.getItem("filesDetails"));
    console.log(tempData)
    const [data, setData] = useState(tempData);
    const [isPopUpVisible, setPopUpVisible] = useState(false);
    const handleReload = () => {
        window.location.reload();
    }

    const newData = [];

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
        
    if (query && tempData && tempData.length !== 0 && value === "") {
        const myfileList = tempData.map(obj => Object.keys(obj)[0]);
        myfileList.forEach((file, index) => {
            if (tempData[index][file]['title'].toLowerCase().includes(query.toLowerCase())) {
                newData.push({[file]: tempData[index][file]})
            };
        });
        console.log("============", newData)
    }

    useEffect(() => {
        console.log
        if (value === "" && tempData) {
            setData(tempData)
        } else if (selectedOption) {
            if (tempData && tempData.length !== 0) {
                const myfileList2 = tempData.map(obj => Object.keys(obj)[0]);
                // const newList = [];
                const newData2 = [];
                const pawn = myfileList2.map((file, index) => {
                    if (tempData[index][file][selectedOption].includes(value)) {
                        newData2.push({[file]: tempData[index][file]})
                        // console.log(newData2)
                        setData(newData2)
                        return ({[file]: tempData[index][file]})
                    };
                });
            }
        }
        // console.log(data)

    }, [value]);
        
    if (query && value === "") {
        const fileList = newData.map(obj => Object.keys(obj)[0])
        return (
            <motion.div
				initial={{ opacity: 0, x: 100 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -100 }}
				className="relative"
			>
            <div className="relative">
                <div className="flex relative z-2">
                    <Sidebar/>
                    <div className={isPopUpVisible ? "blur-[2px] pointer-events-none lg:w-[65%] sm:w-[100%]" : "lg:w-[65%] sm:w-[100%] block"}>
                        <HeaderComponent title="Resources"/>
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
                          
                            <div className="sticky bg-white shadow-lg z-1 border-2 pl-4 pr-4 top-[2%] left-[33%] border-gray-300 rounded-xl w-[50%]">
                                <div className="bg-opacity-100 absolute  h-[100%] flex ">
                                <FaMagnifyingGlass  className="mt-1"/>
                                </div>
                                <input
                                    type='input' placeholder="Search here"
                                    className="bg-opacity-[100%] ml-2 pl-3 outline-none w-[95%]"
                                    onChange={handleSearch}
                                />
                            </div>
                            <div  className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-12 flex z-0 flex-wrap gap-4 justify-around">
                                {fileList.map((file, index) => ( 
                                    <ResourceCard key={index} fileUrl={base_url + file} description={newData[index][file]['description']}
                                    uploaderUsername = {newData[index][file]['uploaderUsername']}
                                    title = {newData[index][file]['title']}
                                    date = {newData[index][file]['date']}
                                    semester = {newData[index][file]['semester']}
                                    course = {newData[index][file]['course']}
                                    />
                                ))}
                            </div>
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
            </motion.div>  
        );
    } else if(tempData && tempData.length !== 0) {
            console.log(data)
            // console.log(`============${data}============`)
            const fileList2 = data.map(obj => Object.keys(obj)[0])
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
                              
                                <div className="sticky bg-white shadow-lg z-1 border-2 pl-4 pr-4 top-[2%] left-[33%] border-gray-300 rounded-xl w-[50%]">
                                    <div className="bg-opacity-100 absolute  h-[100%] flex ">
                                    <FaMagnifyingGlass  className="mt-1"/>
                                    </div>
                                    <input
                                        type='input' placeholder="Search here"
                                        className="bg-opacity-[100%] ml-2 pl-3 outline-none w-[95%]"
                                        onChange={handleSearch}
                                    />
                                </div>
                                <div  className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-12 flex z-0 flex-wrap gap-4 justify-around">
                                    {fileList2.map((file, index) => ( 
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