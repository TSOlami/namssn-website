import Select from 'react-select'
import { useEffect, useState } from "react";
import { PostSearch, ResourceCard } from "../components";
import { HeaderComponent, Sidebar, UserCard } from "../components";
import axios from "axios";
import { formatDateToTime } from "../utils";
import Loader from "../components/Loader";
let base_url = import.meta.env.VITE_BACKEND_URL

const Search = () => {
const [value, setValue] = useState('');
const [filter, setFilter] = useState('')
const [data, setData] = useState(null)
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryValue = params.get('key');
    if (queryValue) {
        setValue(queryValue); // set the search value
    }
}, []);

useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filterValue = params.get('filter');
    if (filterValue) {
        setFilter(filterValue); // set the filter value
    }
}, []);

useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        if (filter && value) {
            try {
                const res = await axios.get(`https://api-namssn-futminna.onrender.com/api/v1/users/search?filter=${filter}&value=${value}`);
                if (res) {
                    setData(res.data); // set the fetched data to the state
                    setIsLoading(false);
                }
            } catch (err) {
                setData("error")
                setIsLoading(false);
            }
        }
    };
    fetchData(); // call the fetchData function
}, [filter, value]);

if (isLoading) {
    return <Loader />; // Render the Loader while data is being fetched
}

const handleClick = (val) => {
    window.location.href = `/search?key=${value}&filter=${val}`
}

const handleReload = () => {
    window.location.reload();
}

const borderStyle = "border-b-[2px] border-blue-400"
const unselectBorderStyle = "border-b-[1px] border-gray-400"
    
if (data && data !== "error" && Object.keys(data).length !==0) {
    let fileUrls = []
    if (data.resources) {
        fileUrls = [...new Set(data.resources.flatMap(obj => Object.keys(obj)))] // a list of file urls
    }

const handleChange = (val) => {
    localStorage.setItem('selectedFilter', val.value)
    handleClick(val.value)
}
const selectedFilter = localStorage.getItem('selectedFilter')
const customStyles = {
    option: (provided, state) => ({
        ...provided,
        borderLeft: state.value===selectedFilter ? '2px solid blue' : '',
        color: state.isSelected ? 'blue' : 'black', // Change the color based on selection
        font: 'serif',
    }),
    };
const options = [
    { value: 'all', label: 'All' },
    { value: 'users', label: 'Users' },
    { value: 'resources', label: 'Resources' },
    { value: 'posts', label: 'Posts' }
];

if (isLoading) {
    return <Loader />; // Render the Loader while data is being fetched
}

return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-col sm:w-full md:w-80%">
                <div className="sticky top-[0.01%] z-[300] bg-white">
                    <HeaderComponent title="SEARCH" url={"Placeholder"} />
                </div>
                <div className='sticky top-[14.5%] z-[300] mt-4 font-serif w-[200px] lg:hidden md:hidden'>
                    <Select onChange={handleChange} options={options} styles={customStyles} isSearchable={false} placeholder="Filter"/>
                </div>
                <div className="hidden sticky top-[8%] h-10 z-[300] bg-white font-serif md:flex lg:flex flex-row w-[100%]">
                        <div onClick={() => handleClick('all')} className={`mt-4 hover:text-blue-500 cursor-pointer w-[25%] flex justify-center ${filter==='all' ? borderStyle : unselectBorderStyle}`}>
                            All
                        </div>
                        <div onClick={() => handleClick('users')} className={`mt-4 hover:text-blue-500 cursor-pointer w-[25%] flex justify-center ${filter==='users' ? borderStyle : unselectBorderStyle}`}>
                            Users
                        </div>
                        <div onClick={() => handleClick('resources')} className={`mt-4 hover:text-blue-500 cursor-pointer w-[25%] flex justify-center ${filter==='resources' ? borderStyle : unselectBorderStyle}`}>
                            Resources
                        </div>
                        <div onClick={() => handleClick('posts')} className={`mt-4 hover:text-blue-500 cursor-pointer w-[25%] flex justify-center ${filter==='posts' ? borderStyle : unselectBorderStyle}`}>
                            Posts
                        </div>
                </div>
                {filter==='all' && data.users && data.users.length!==0 && <div className="ml-6 mt-8">
                    <div className="mb-2 font-serif text-lg text-gray-400">
                        <span>Users</span>
                    </div>
                    {data.users.map((user, index) => (
                        <UserCard key={index} name={user.name} u_id={user._id}
                        username={user.username} isVerified={user.isVerified}
                        avatar={user.profilePicture}
                        />
                    ))}
                </div>}
                {filter==='users' && data.users && data.users.length!==0 ? (<div className="ml-6 mt-8">
                    <div className="mb-2 font-serif text-lg text-gray-400">
                        <span>Users</span>
                    </div>
                    {data.users.map((user, index) => (
                        <UserCard key={index} name={user.name} u_id={user._id}
                        username={user.username} isVerified={user.isVerified}
                        avatar={user.profilePicture}
                        />
                    ))}
                </div>) : filter==='users' && (
                <div className="flex flex-col items-center relative top-[13em]">
                    <div><span className="font-serif sm:text-md lg:text-lg text-gray-400"> No matching user </span></div>
                </div>
                )}
                {filter==='all' && data.resources && data.resources.length!==0 && <div className="ml-6 mt-4">
                    {<div className="font-serif text-lg text-gray-400">
                        <span>Resources</span>
                    </div>}
                    <div className="lg:px-[0.3em] flex flex-wrap gap-4 justify-around">
                    {data.resources && filter==='all' && data.resources.map((resource, index) => (
                        <ResourceCard key={index} fileUrl={base_url + fileUrls[index]} description={resource[fileUrls[index]]['description']}
                        uploaderUsername = {resource[fileUrls[index]]['uploaderUsername']}
                        title = {resource[fileUrls[index]]['title']}
                        date = {formatDateToTime(new Date(resource[fileUrls[index]]['date']))}
                        semester = {resource[fileUrls[index]]['level']}
                        course = {resource[fileUrls[index]]['course']}
                        />
                    ))}
                    </div>
                </div>}
                {filter==='resources' && data.resources && data.resources.length!==0  ? (<div className="ml-6 mt-4">
                    {<div className="font-serif text-lg text-gray-400">
                        <span>Resources</span>
                    </div>}
                    <div className="lg:px-[0.3em]  flex flex-wrap gap-4 justify-around">
                    {data.resources && filter==='resources' && data.resources.map((resource, index) => (
                        <ResourceCard key={index} fileUrl={base_url + fileUrls[index]} description={resource[fileUrls[index]]['description']}
                        uploaderUsername = {resource[fileUrls[index]]['uploaderUsername']}
                        title = {resource[fileUrls[index]]['title']}
                        date = {formatDateToTime(new Date(resource[fileUrls[index]]['date']))}
                        semester = {resource[fileUrls[index]]['level']}
                        course = {resource[fileUrls[index]]['course']}
                        />
                    ))}
                    </div>
                </div>) : filter==='resources' && (
                <div className="flex flex-col items-center relative top-[13em]">
                    <div><span className="font-serif sm:text-md lg:text-lg text-gray-400"> No matching resource </span></div>
                </div>
                )}
                {filter==='all' && data.posts && data.posts.length!==0 && <div className="mt-4">
                {<div className="mb-2 ml-6 font-serif text-lg text-gray-400">
                                <span>Posts</span>
                    </div>}
                    {data.posts && filter==='all' && data.posts.map((post, index) => (
                    <PostSearch
                        key={index}
                        upvotes={post?.upvotes}
                        downvotes={post?.downvotes}
                        comments={post?.comments}
                        isVerified={post?.user?.isVerified}
                        text={post?.text}
                        name={post?.user?.name}
                        username={post?.user?.username}
                        avatar={post?.user?.profilePicture}
                        createdAt={post?.createdAt}
                        updatedAt={post?.updatedAt}
                        u_id={post?.user?._id}
                        postId={post?._id}
                        image={post?.image}
                    />
                ))}
                </div>}
                {filter==='posts' && data.posts && data.posts.length!==0 ? (<div className="mt-4 pt-0">
                {<div className="mb-2 ml-6 font-serif text-lg text-gray-400">
                                <span>Posts</span>
                    </div>}
                    {data.posts && filter==='posts' && data.posts.map((post, index) => (
                    <PostSearch
                        key={index}
                        upvotes={post?.upvotes?.length}
                        downvotes={post?.downvotes?.length}
                        comments={post?.comments?.length}
                        isVerified={post?.user?.isVerified}
                        text={post?.text}
                        name={post?.user?.name}
                        username={post?.user?.username}
                        avatar={post?.user?.profilePicture}
                        createdAt={post?.createdAt}
                        updatedAt={post?.updatedAt}
                        u_id={post?.user?._id}
                        postId={post?._id}
                        image={post?.image}
                    />
                ))}
                </div>) : filter==='posts' && (
                <div className="flex flex-col items-center relative top-[13em]">
                    <div><span className="font-serif sm:text-md lg:text-lg text-gray-400"> No matching post </span></div>
                </div>
                )}
            </div>
                {/* <div className="w-[%]">
                    <AnnouncementContainer/>
                </div> */}
        </div>
    )
    
} else if(data && Object.keys(data).length===0) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex w-[100%] flex-col">
                <div className="sticky top-[0.01%] z-[300] bg-white">
                        <HeaderComponent title="SEARCH" url={"Placeholder"} />
                </div>
                <div className="flex flex-col items-center relative top-[15em]">
                    <div><span className="font-serif sm:text-md lg:text-lg text-gray-400"> No matching result </span></div>
                </div>
            </div>
        </div>
    )
} else if (data === "error") {
    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex w-[100%] flex-col">
                <div className="sticky top-[0.01%] z-[300] bg-white">
                        <HeaderComponent title="SEARCH" url={"Placeholder"} />
                </div>
                <div className="flex flex-col items-center relative top-[15em]">
                    <div><span className="font-serif sm:text-md lg:text-lg text-gray-400"> An error occured </span></div>
                    <div><span className="font-serif sm:text-md lg:text-lg text-gray-400"> Click <span onClick={handleReload} className="text-green-500 cursor-pointer  hover:text-green-300">here</span> to reload </span></div>
                </div>
            </div>
        </div>
    )
} else if(data===null) {
    return (
        <div className="text-xl font-roboto text-gray-300 w-[100%] fixed left-[50%] font-medium top-[40%]">
            Loading...
        </div>
    )}
};

export default Search;
