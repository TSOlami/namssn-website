import { useParams } from "react-router-dom";
import { HeaderComponent, ResourceCard, Sidebar, AnnouncementContainer } from "../components";
import { formatDateToTime } from "../utils";
import { useState, useMemo } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ResourceListSkeleton } from "../components/skeletons";
import ErrorPage from "./ErrorPage";
import { getResourcesUrl } from "../config/api";
import { useGetResourcesByLevelQuery } from "../redux";

const ROUTES = ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'telegram'];

const LevelResources = () => {
    const { level } = useParams();
    const [value, setValue] = useState("");
    const modifiedString = level === "telegram" ? "telegram" : (level || "").replace(/ /g, " ");
    const skip = !modifiedString || !ROUTES.includes(level);
    const { data, isLoading, isError, refetch } = useGetResourcesByLevelQuery(modifiedString, { skip });

    const handleSearch = (e) => setValue(e.target.value);
    const displayedData = useMemo(() => {
        if (!data || !Array.isArray(data)) return data;
        if (!value.trim()) return data;
        const lower = value.toLowerCase();
        return data.filter((obj) => {
            const file = Object.keys(obj)[0];
            const item = obj[file];
            return item?.title && item.title.toLowerCase().includes(lower);
        });
    }, [data, value]);
    const handleReload = () => refetch();

    if (!level || !ROUTES.includes(level)) {
        return (
            <div>
                <ErrorPage/>
            </div>
        );
    }

    if (data && Array.isArray(data) && !isError && displayedData) {
        const fileList = displayedData.map(obj => Object.keys(obj)[0])
        return (
            <div className="flex">
                <Sidebar/>
                <div className="lg:w-full sm:w-[100%] block">
                    <div className="sticky top-[0.01%] z-[300] bg-white">
                        <HeaderComponent title={`${level} Resources`} url={"Placeholder"}/>
                    </div>
                    <div>
                        <div className="mb-4 flex justify-between">
                        </div>
                        <div className="sticky bg-white ring-2 border-2 z-[500] left-4 right-4 md:left-[33%] md:right-auto w-[calc(100%-2rem)] md:w-[50%] pl-4 pr-4 top-[15%] md:top-[13%] border-gray-300 rounded-xl">
                            <div className="absolute h-[100%] flex pointer-events-none">
                            <FaMagnifyingGlass className="mt-1"/>
                            </div>
                            <input
                                type='input' placeholder="Search here"
                                className="bg-opacity-[100%] ml-2 pl-3 outline-none w-[95%]"
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                            {fileList.map((file, index) => {
                                const baseUrl = getResourcesUrl();
                                const item = displayedData[index]?.[file];
                                const base = baseUrl.replace(/\/$/, '');
                                const fileUrl = item ? `${base}/${file}+${encodeURIComponent(item.title ?? '')}` : `${base}/${file}`;
                                return (
                                <ResourceCard key={index} fileUrl={fileUrl} description={item?.description}
                                uploaderUsername={item?.uploaderUsername}
                                title={item?.title}
                                date={item?.date ? formatDateToTime(new Date(item.date)) : ''}
                                semester={item?.semester}
                                course={item?.course}
                                />
                            );})}
                        </div>
                </div>
                </div>
            </div>
        )
    } else if (isError) {
        return (
            <div className="lg:flex lg:justify-between">
                <Sidebar/>
                <div className="text-xl flex flex-col items-center font-roboto text-gray-500 w-[100%] fixed right-[3%] font-medium top-[40%]">
                    <div><span>Unable to fetch resources.</span></div>
                    <div><span>Click <span onClick={handleReload} className="text-green-500 cursor-pointer  hover:text-green-300">here</span> to reload.</span></div>
                </div>
                <div className="flex-shrink-0 sm:hidden md:hidden hidden lg:block">
                    <AnnouncementContainer />
                </div>
            </div>
        )
    } else {
        return (
            <div className="w-[100%] flex justify-between">
                <Sidebar/>
                <div className="lg:w-[100%] sm:w-[100%] block">
                    <div className="sticky top-[0.01%] z-[300] bg-white">
                        <HeaderComponent title={`${level} Resources`} url={"Placeholder"}/>
                    </div>
                    <div className="p-4">
                        <ResourceListSkeleton count={6} />
                    </div>
                </div>
                <div className="flex-shrink-0 sm:hidden md:block hidden lg:block">
                    <AnnouncementContainer />
                </div>
            </div>
            )
    }
}

export default LevelResources;