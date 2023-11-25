import { useParams } from "react-router-dom";
import { HeaderComponent, ResourceCard, Sidebar, AnnouncementContainer } from "../components";
import { formatDateToTime } from "../utils";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Loader from "../components/Loader";
import ErrorPage from "./ErrorPage";

const base_url = "https://namssn-futminna.onrender.com/api/v1/users/resources/";
const routes = ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'telegram'];

const LevelResources = () => {
    const {level} = useParams()
    let modifiedString = level.replace(/ /g, " ");
    if (level === 'telegram') {
        modifiedString = 'telegram'
    }

    if (!routes.includes(level)) {
        return (
            <div>
                <ErrorPage/>
            </div>
            )
    }
    const [data, setData] = useState(null)
    const [tempData, setTempData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`https://namssn-futminna.onrender.com/api/v1/users/${modifiedString}/resources/`);
                if (res) {
                    setData(res.data); // set the fetched data to the state
                    setTempData(res.data)
                }
            } catch (err) {
                setData("error")
            }
        };
        fetchData(); // call the fetchData function
    }, []);

    const [value, setValue] = useState("")
    const isLoading = true;

    const handleSearch = (e) => {
        setValue(e.target.value)
    }

    useEffect(() => {
            if (value === '' && tempData) {
                // if value is an empty string
                setData(tempData)
            } else if (value !== '') {
                // if value is not an empty string
                if (data && data.length !== 0) {
                    const myfileList = data.map(obj => Object.keys(obj)[0]); // a list of file names
                    const newData = [];
                    myfileList.map((file, index) => {
                        if (data[index][file]['title'] && data[index][file]['title'].toLowerCase().includes(value.toLowerCase())) {
                           newData.push({[file]: data[index][file]})
                            setData(newData)
                        };
                    });
                }
            }
        }, [value]);

        const handleReload = () => {
            // reloads the page
            window.location.reload();
        }
    
    if (data && data !== "error") {
        const fileList = data.map(obj => Object.keys(obj)[0])
        return (
            <div className="flex">
                <Sidebar/>
                <div className="lg:w-[100%%] sm:w-[100%] block">
                    <div className="sticky top-[0.01%] z-[300] bg-white">
                        <HeaderComponent title={`${level} Resources`} url={"Placeholder"}/>
                    </div>
                    <div>
                        <div className="mb-4 flex justify-between">
                        </div>
                        <div className="sticky bg-white ring-2 border-2 z-[500] pl-4 pr-4 top-[15%] md:top-[13%] left-[33%] border-gray-300 rounded-xl w-[50%]">
                            <div className="absolute  h-[100%] flex ">
                            <FaMagnifyingGlass  className="mt-1"/>
                            </div>
                            <input
                                type='input' placeholder="Search here"
                                className="bg-opacity-[100%] ml-2 pl-3 outline-none w-[95%]"
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                            {fileList.map((file, index) => ( 
                                <ResourceCard key={index} fileUrl={base_url + file + '+' + data[index][file]['title']} description={data[index][file]['description']}
                                uploaderUsername = {data[index][file]['uploaderUsername']}
                                title = {data[index][file]['title']}
                                date = {formatDateToTime(new Date(data[index][file]['date']))}
                                semester = {data[index][file]['semester']}
                                course = {data[index][file]['course']}
                                />
                            ))}
                        </div>
                </div>
                </div>
            </div>
        )
    } else if (data && data === "error") {
        return (
            <div className="lg:flex lg:justify-between">
                <Sidebar/>
                <div className="text-xl flex flex-col items-center font-roboto text-gray-500 w-[100%] fixed right-[3%] font-medium top-[40%]">
                    <div><span>Unable to fetch resources.</span></div>
                    <div><span>Click <span onClick={handleReload} className="text-green-500 cursor-pointer  hover:text-green-300">here</span> to reload.</span></div>
                </div>
                <div className="w-[27%] sm:hidden md:hidden hidden lg:block">
                    <AnnouncementContainer />
                </div>
            </div>
        )
    } else if (data === null) {
        return (
            <div className="w-[100%] flex justify-between">
                <Sidebar/>
                {/* <div className="text-xl font-roboto text-gray-300 w-[100%] fixed left-[40%] font-medium top-[40%]">
                    Fetching...
                </div> */}
                <div className="w-[27%] sm:hidden md:block hidden lg:block">
                    <AnnouncementContainer />
                </div>
                {isLoading && <Loader />}
            </div>
            )
    }
}

export default LevelResources;