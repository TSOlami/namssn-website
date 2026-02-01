import { useState } from "react";
import { useSelector } from "react-redux";
import {
	HeaderComponent,
	AnnouncementContainer,
	FileForm,
} from "../components";
import { Sidebar } from "../components";
import { ResourceCard } from "../components";
import { formatDateToTime } from "../utils";
import { ResourcePageSkeleton } from '../components/skeletons';
import { Link } from "react-router-dom";
import { BiSolidUpvote, BiCaretDown, BiCaretUp } from "react-icons/bi";
import { getResourcesUrl } from "../config/api";
import { useGetResourcesQuery } from "../redux";

const levelStyle = "w-[100%] cursor-pointer  h-8 flex justify-end pr-2 rounded-lg items-center shadow-lg hover:ring-2";

const Resources = () => {
    const userInfo = useSelector((state) => state.auth?.userInfo);
    const { data, isLoading, isError, refetch } = useGetResourcesQuery();
    const [isPopUpVisible, setPopUpVisible] = useState(false);
    const [dropDown1, setDropDown1] = useState(1);
    const [dropDown2, setDropDown2] = useState(2);
    const [dropDown3, setDropDown3] = useState(3);
    const [dropDown4, setDropDown4] = useState(4);
    const [dropDown5, setDropDown5] = useState(5);
    const [dropDown6, setDropDown6] = useState(6);
    const handleReload = () => refetch();

    const handlePopUpOpen = () => {
        setPopUpVisible(true);
    };

    const handlePopUpClose = () => {
        setPopUpVisible(false);
    };

    const toggleDropDown1 = () => {
        setDropDown1(dropDown1 * -1)
    }
    const toggleDropDown2 = () => {
        setDropDown2(dropDown2 * -1)
    }
    const toggleDropDown3 = () => {
        setDropDown3(dropDown3 * -1)
    }
    const toggleDropDown4 = () => {
        setDropDown4(dropDown4 * -1)
    }
    const toggleDropDown5 = () => {
        setDropDown5(dropDown5 * -1)
    }
    const toggleDropDown6 = () => {
        setDropDown6(dropDown6 * -1)
    }

    if (isLoading) {
        return (
        <div className="w-[100%] flex justify-between">
            <Sidebar/>
            <div className="lg:w-[65%] sm:w-[100%] block">
                <div className="sticky top-[0.01%] z-[300] bg-white w-[100%]">
                    <HeaderComponent title="RESOURCES" url={"Placeholder"}/>
                </div>
                <ResourcePageSkeleton />
            </div>
            <div className="w-[27%] sm:hidden md:block hidden lg:block">
                <AnnouncementContainer />
            </div>
        </div>
        )
    }
    const isDataObject = data && typeof data === 'object' && !Array.isArray(data) && data !== "error";
    const hasData = data && data !== "error" && (Array.isArray(data) ? data.length > 0 : isDataObject && Object.keys(data).length > 0);
    if (hasData && isDataObject) {
        const level1FileList = data['100 Level'] ? data['100 Level'].map(obj => Object.keys(obj)[0]) : null;
        const level2FileList = data['200 Level'] ? data['200 Level'].map(obj => Object.keys(obj)[0]) : null;
        const level3FileList = data['300 Level'] ? data['300 Level'].map(obj => Object.keys(obj)[0]) : null;
        const level4FileList = data['400 Level'] ? data['400 Level'].map(obj => Object.keys(obj)[0]) : null;
        const level5FileList = data['500 Level'] ? data['500 Level'].map(obj => Object.keys(obj)[0]) : null;
        const telegram = data['N/A'] ? data['N/A'].map(obj => Object.keys(obj)[0]) : null;
        if (level1FileList === null && level2FileList === null && level3FileList === null
            && level4FileList === null && level5FileList === null && telegram === null) {
            return (
                    <div className="lg:flex lg:justify-between">
                        <Sidebar/>
                        <div className="text-xl flex flex-col items-center font-roboto text-gray-500 w-[100%] fixed right-[3%] font-medium top-[40%]">
                            <div><span>No resources uploaded yet</span></div>
                        </div>
                        <div className={isPopUpVisible ? "blur-[2px] pointer-events-none lg:w-[65%] sm:w-[100%]" : "lg:w-[65%] sm:w-[100%] block"}>
                            <button onClick={handlePopUpOpen} className="drop-shadow-2xl ring-2 hover:ring-4 fring-4 fixed left-[45%] top-[45%] z-10 bg-green-600 text-white py-2 px-4 rounded-full">
                            <BiSolidUpvote color="#fff"/>
                            </button>
                        </div>
                        <div className="w-[27%] sm:hidden bg-slate-800 md:hidden hidden lg:block">
                            <AnnouncementContainer />
                        </div>
                        <div className="fixed z-1 bottom-[7em] left-[10%] md:left-[15em] lg:left-[20em] w-[100%] md:w-[50%]">
                            <FileForm name={userInfo?.name} userId={userInfo?._id} show={isPopUpVisible} onClose={handlePopUpClose} />
                        </div>        
                    </div>
            )
        }
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
                            <div onClick={toggleDropDown1} className={`${levelStyle} ${dropDown1 === -1 ? 'ring-2 hover:ring-0 bg-gray-900' : 'bg-gray-900'}`}>
                                <span className={`font-bold pl-4 absolute left-4 lg:left-[14em] font-roboto sm:text-xl ${dropDown1 === -1 ? 'text-blue-300' : 'text-white'} text-sm`}>100 Level</span>
                                {dropDown1 === -1 ? (<BiCaretUp color="#40aaca"/>) : (<BiCaretDown color="#fff"/>)}
                            </div>
                            {dropDown1===-1 && <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                                    {level1FileList.map((file, index) => {
                                        const item = data['100 Level']?.[index]?.[file];
                                        const base = getResourcesUrl().replace(/\/$/, '');
                                        const fileUrl = item ? `${base}/${file}+${encodeURIComponent(item.title ?? '')}` : `${base}/${file}`;
                                        return (
                                        <ResourceCard key={index} fileUrl={fileUrl} description={item?.description}
                                        uploaderUsername={item?.uploaderUsername}
                                        uploaderId={item?.uploaderId}
                                        title={item?.title}
                                        date={item?.date ? formatDateToTime(new Date(item.date)) : ''}
                                        semester={item?.semester}
                                        course={item?.course}
                                        isLarge={item?.isLarge}
                                        fileUrl2={file}
                                        />
                                    );})}
                                </div>}
                                {level1FileList.length > 4 && dropDown1===-1 && (
                                <Link to="/resources/100%20Level">
                                    <button className="w-[100%] bg-blue-600 hover:bg-white hover:text-blue-600 border-2 hover:border-blue-600 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button>
                                </Link>)}
                            </div>)}
                            {level2FileList && (<div className="px-4 pt-6 pb-4 flex items-center flex-col">
                            <div onClick={toggleDropDown2} className={`${levelStyle} ${dropDown2 === -2 ? 'ring-2 hover:ring-0 bg-gray-900' : 'bg-gray-900'}`}>
                                <span className={`font-bold pl-4 absolute left-4 lg:left-[14em] font-roboto sm:text-xl ${dropDown2 === -2 ? 'text-blue-300' : 'text-white'} text-sm`}>200 Level</span>
                                {dropDown2 === -2 ? (<BiCaretUp color="#40aaca"/>) : (<BiCaretDown color="#fff"/>)}
                            </div>
                            {dropDown2===-2 && <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                                    {level2FileList.map((file, index) => {
                                        const item = data['200 Level']?.[index]?.[file];
                                        const base = getResourcesUrl().replace(/\/$/, '');
                                        const fileUrl = item ? `${base}/${file}+${encodeURIComponent(item.title ?? '')}` : `${base}/${file}`;
                                        return (
                                        <ResourceCard key={index} fileUrl={fileUrl} description={item?.description}
                                        uploaderUsername={item?.uploaderUsername}
                                        uploaderId={item?.uploaderId}
                                        title={item?.title}
                                        date={item?.date ? formatDateToTime(new Date(item.date)) : ''}
                                        semester={item?.semester}
                                        course={item?.course}
                                        isLarge={item?.isLarge}
                                        fileUrl2={file}
                                        />
                                    );})}
                                </div>}
                                {level2FileList.length > 4 && dropDown2===-2 && (
                                <Link to="/resources/200%20Level">
                                    <button className="w-[100%] bg-blue-600 hover:bg-white hover:text-blue-600 border-2 hover:border-blue-600 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button>
                                </Link>)}
                            </div>)}
                            {level3FileList && (<div className="px-4 pt-6 pb-4 flex items-center flex-col">
                            <div onClick={toggleDropDown3} className={`${levelStyle} ${dropDown3 === -3 ? 'ring-2 hover:ring-0 bg-gray-900' : 'bg-gray-900'}`}>
                                <span className={`font-bold pl-4 absolute left-4 lg:left-[14em] font-roboto sm:text-xl ${dropDown3 === -3 ? 'text-blue-300' : 'text-white'} text-sm`}>300 Level</span>
                                {dropDown3 === -3 ? (<BiCaretUp color="#40aaca"/>) : (<BiCaretDown color="#fff"/>)}
                            </div>
                            {dropDown3===-3 && <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                                    {level3FileList.map((file, index) => ( 
                                        <ResourceCard  key={index} fileUrl={`${getResourcesUrl().replace(/\/$/, '')}/${file}+${encodeURIComponent(data['300 Level']?.[index]?.[file]?.title ?? '')}`} description={data['300 Level']?.[index]?.[file]?.description}
                                        uploaderUsername={data['300 Level']?.[index]?.[file]?.uploaderUsername}
                                        uploaderId={data['300 Level']?.[index]?.[file]?.uploaderId}
                                        title={data['300 Level']?.[index]?.[file]?.title}
                                        date={data['300 Level']?.[index]?.[file]?.date ? formatDateToTime(new Date(data['300 Level'][index][file].date)) : ''}
                                        semester={data['300 Level']?.[index]?.[file]?.semester}
                                        course={data['300 Level']?.[index]?.[file]?.course}
                                        isLarge={data['300 Level']?.[index]?.[file]?.isLarge}
                                        fileUrl2={file}
                                        />
                                    ))}
                                </div>}
                                {level3FileList.length > 4 && dropDown3===-3 && (
                                <Link to="/resources/300%20Level">
                                    <button className="w-[100%] bg-blue-600 hover:bg-white hover:text-blue-600 border-2 hover:border-blue-600 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button>
                                </Link>)}
                            </div>)}
                            {level4FileList && (<div className="px-4 pt-6 pb-4 flex items-center flex-col">
                            <div onClick={toggleDropDown4} className={`${levelStyle} ${dropDown4 === -4 ? 'ring-2 hover:ring-0 bg-gray-900' : 'bg-gray-900'}`}>    
                                <span className={`font-bold pl-4 absolute left-4 lg:left-[14em] font-roboto sm:text-xl ${dropDown4 === -4 ? 'text-blue-300' : 'text-white'} text-sm`}>400 Level</span>
                                {dropDown4 === -4 ? (<BiCaretUp color="#40aaca"/>) : (<BiCaretDown color="#fff"/>)}
                            </div>
                            {dropDown4===-4 && <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                                    {level4FileList.map((file, index) => {
                                        const item = data['400 Level']?.[index]?.[file];
                                        const base = getResourcesUrl().replace(/\/$/, '');
                                        const fileUrl = item ? `${base}/${file}+${encodeURIComponent(item.title ?? '')}` : `${base}/${file}`;
                                        return (
                                        <ResourceCard key={index} fileUrl={fileUrl} description={item?.description}
                                        uploaderUsername={item?.uploaderUsername}
                                        uploaderId={item?.uploaderId}
                                        title={item?.title}
                                        date={item?.date ? formatDateToTime(new Date(item.date)) : ''}
                                        semester={item?.semester}
                                        course={item?.course}
                                        isLarge={item?.isLarge}
                                        fileUrl2={file}
                                        />
                                    );})}
                                </div>}
                                    {level4FileList.length > 4 && dropDown4===-4 && (
                                    <Link to="/resources/400%20Level">
                                        <button className="w-[100%] bg-blue-600 hover:bg-white hover:text-blue-600 border-2 hover:border-blue-600 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button>
                                    </Link>)}
                            </div>)}
                            {level5FileList && (<div className="px-4 pt-6 pb-4 flex items-center flex-col">
                            <div onClick={toggleDropDown5} className={`${levelStyle} ${dropDown5 === -5 ? 'ring-2 hover:ring-0 bg-gray-900' : 'bg-gray-900'}`}>
                                <span className={`font-bold pl-4 absolute left-4 lg:left-[14em] font-roboto sm:text-xl ${dropDown5 === -5 ? 'text-blue-300' : 'text-white'} text-sm`}>500 Level</span>
                                {dropDown5 === -5 ? (<BiCaretUp color="#40aaca"/>) : (<BiCaretDown color="#fff"/>)}
                            </div>
                            {dropDown5===-5 && <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                                    {level5FileList.map((file, index) => {
                                        const item = data['500 Level']?.[index]?.[file];
                                        const base = getResourcesUrl().replace(/\/$/, '');
                                        const fileUrl = item ? `${base}/${file}+${encodeURIComponent(item.title ?? '')}` : `${base}/${file}`;
                                        return (
                                        <ResourceCard key={index} fileUrl={fileUrl} description={item?.description}
                                        uploaderUsername={item?.uploaderUsername}
                                        uploaderId={item?.uploaderId}
                                        title={item?.title}
                                        date={item?.date ? formatDateToTime(new Date(item.date)) : ''}
                                        semester={item?.semester}
                                        course={item?.course}
                                        isLarge={item?.isLarge}
                                        fileUrl2={file}
                                        />
                                    );})}
                                </div>}
                                {level5FileList.length > 4 && dropDown5===-5 && (
                                <Link to="/resources/500%20Level">
                                    <button className="w-[100%] bg-blue-600 hover:bg-white hover:text-blue-600 border-2 hover:border-blue-600 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button>
                                </Link>)}
                            </div>)}
                            {telegram && (<div className="px-4 pt-6 pb-4 flex items-center flex-col">
                            <div onClick={toggleDropDown6} className={`${levelStyle} ${dropDown6 === -6 ? 'ring-2 hover:ring-0 bg-gray-900' : 'bg-gray-900'}`}>
                                <span className={`font-bold pl-4 absolute left-4 lg:left-[14em] font-roboto sm:text-xl ${dropDown6 === -6 ? 'text-blue-300' : 'text-white'} text-sm`}>Telegram</span>
                                {dropDown6 === -6 ? (<BiCaretUp color="#40aaca"/>) : (<BiCaretDown color="#fff"/>)}
                            </div>
                            {dropDown6===-6 && <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                                    {telegram.map((file, index) => {
                                        const item = data['N/A']?.[index]?.[file];
                                        const base = getResourcesUrl().replace(/\/$/, '');
                                        const fileUrl = item ? `${base}/${file}+${encodeURIComponent(item.title ?? '')}` : `${base}/${file}`;
                                        return (
                                        <ResourceCard key={index} fileUrl={fileUrl} description={item?.description}
                                        uploaderUsername={item?.uploaderUsername}
                                        uploaderId={item?.uploaderId}
                                        title={item?.title}
                                        date={item?.date ? formatDateToTime(new Date(item.date)) : ''}
                                        semester={item?.semester}
                                        course={item?.course}
                                        />
                                    );})}
                                </div>}
                                {telegram.length > 4 && dropDown6===-6 && (
                                <Link to="/resources/telegram">
                                    <button className="w-[100%] bg-blue-600 hover:bg-white hover:text-blue-600 border-2 hover:border-blue-600 font-serif text-md text-white py-2 px-4 rounded-xl mt-4"> more </button>
                                </Link>)}
                            </div>)}
                        </div> 
                        <button onClick={handlePopUpOpen} className="drop-shadow-2xl ring-2 hover:ring-4 fring-4 fixed bottom-4 right-4 md:right-[18em] lg:right-[30%] xl:right-[30%] z-10 bg-green-600 text-white py-2 px-4 rounded-full">
                            <BiSolidUpvote color="#fff"/>
                        </button>
                        
                    </div>
                    <div className={isPopUpVisible ? "blur-[2px] pointer-events-none w-[35%] sm:hidden md:hidden hidden bg-gray-200 lg:block": " w-[25%] sm:hidden bg-gray-200 md:hidden hidden lg:block"}>
                        <AnnouncementContainer />
                    </div>
                </div>
                <div className="fixed z-1 bottom-[7em] left-[10%] md:left-[15em] lg:left-[20em] w-[100%] md:w-[50%]">
                    <FileForm name={userInfo?.name} userId={userInfo?._id} show={isPopUpVisible} onClose={handlePopUpClose} />
                </div>
            </div>  
        );
    } else if (data && !hasData) {
            return (
            <div className="flex">
                <Sidebar/>
                <div className="text-xl font-roboto text-gray-300 w-[100%] fixed left-[40%] font-medium top-[40%]">
                    No file uploaded yet
                </div>
                <div className={isPopUpVisible ? "blur-[2px] pointer-events-none lg:w-[65%] sm:w-[100%]" : "lg:w-[65%] sm:w-[100%] block"}>
                    <button onClick={handlePopUpOpen} className="drop-shadow-2xl ring-2 hover:ring-4 fring-4 fixed left-[45%] top-[45%] z-10 bg-green-600 text-white py-2 px-4 rounded-full">
                    <BiSolidUpvote color="#fff"/>
                    </button>
                </div>
                <div className={isPopUpVisible ? "blur-[2px] pointer-events-none w-[35%] sm:hidden md:block hidden lg:block bg-gray-200": "w-[35%] bg-gray-200 sm:hidden md:block hidden lg:block"}>
                    <AnnouncementContainer />
                </div>
                <div className="fixed z-1 bottom-[10em] left-[10%] md:left-[15em] lg:left-[20em] w-[100%] md:w-[50%]">
                        <FileForm name={userInfo?.name} userId={userInfo?._id} show={isPopUpVisible} onClose={handlePopUpClose} />
                </div>
            </div>
        )
    } else if (isError) {
        return (
            <div className="lg:flex lg:justify-between">
                <Sidebar/>
                <div className="text-xl flex flex-col items-center font-roboto text-gray-500 w-[100%] fixed right-[3%] font-medium top-[40%]">
                    <div><span>Unable to fetch resources</span></div>
                    <div><span>Click <span onClick={handleReload} className="text-green-500 cursor-pointer  hover:text-green-300">here</span> to reload</span></div>
                </div>
                <div className="w-[27%] sm:hidden bg-slate-800 md:hidden hidden lg:block">
                    <AnnouncementContainer />
                </div>
            </div>
        )
    }
}

    export default Resources;