import Select from 'react-select'
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Resources from "./Resources";
import store from "../redux/store/store";
import { PostSearch, ResourceCard,AnnouncementContainer  } from "../components";
import { HeaderComponent, Sidebar, UserCard } from "../components";
import axios from "axios";
import { formatDateToTime } from "../utils";

const state = store.getState();

const base_url = "http://localhost:5000/api/v1/users/resources/";
const Search = () => {
    const [value, setValue] = useState('');
    const [filter, setFilter] = useState('')
    const [data, setData] = useState(null)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const queryValue = params.get('key');
        if (queryValue) {
            setValue(queryValue);
            console.log(queryValue)
        }
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const filterValue = params.get('filter');
        if (filterValue) {
            setFilter(filterValue);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (filter && value) {
                try {
                    const res = await axios.get(`http://localhost:5000/api/v1/users/search?filter=${filter}&value=${value}`);
                    if (res) {
                        console.log(res);
                        // setData({})
                        setData(res.data); // set the fetched data to the state
                    }
                } catch (err) {
                    console.log(err);
                    setData("error")
                }
            }
        };
        fetchData(); // call the fetchData function
    }, [filter, value]);

    const handleClick = (val) => {
        window.location.href = `/search?key=${value}&filter=${val}`
    }

    const handleReload = () => {
        window.location.reload();
    }

    const borderStyle = "border-b-[2px] border-blue-400"
    const unselectBorderStyle = "border-b-[1px] border-gray-400"
      
    if (data && data !== "error" && Object.keys(data).length !==0) {
        console.log(data.users)
        let fileUrls = []
        if (data.resources) {
            fileUrls = [...new Set(data.resources.flatMap(obj => Object.keys(obj)))]
            // console.log(data.resources)
            // console.log(fileUrls)
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
    console.log(selectedFilter)
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex flex-col sm:w-full md:w-80%">
                    <div className="sticky top-[0.01%] z-[300] bg-white">
                        <HeaderComponent title="SEARCH" url={"Placeholder"} />
                    </div>
                    <div className='mt-4 font-serif w-[200px] lg:hidden md:hidden'>
                        <Select onChange={handleChange} options={options} styles={customStyles} isSearchable={false} placeholder="Filter"/>
                    </div>
                    <div className="hidden sticky top-[8.5%] h-10 z-[300] bg-white font-serif md:flex lg:flex flex-row w-[100%]">
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
                    {filter==='all' && data.users && data.users.length!==0 && <div className="ml-6 mt-4">
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
                    {filter==='users' && data.users && data.users.length!==0 ? (<div className="ml-6 mt-4">
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
                    <div className="text-xl font-crimson text-gray-300 w-[100%] fixed left-[25%] md:left-[40%] lg:left-[50%] font-medium top-[50%]"> No matching user was found</div>
                    )}
                    {filter==='all' && data.resources && data.resources.length!==0 && <div className="ml-6 mt-4">
                        {<div className="font-serif text-lg text-gray-400">
                            <span>Resources</span>
                        </div>}
                        <div className="lg:px-[0.3em] flex flex-wrap gap-4 justify-around">
                        {data.resources && filter==='all' && data.resources.map((resource, index) => (
                            // {console.log(base_url + fileUrls[index], resource[fileUrls[index]]['level'], resource[fileUrls[index]]['title'], resource[fileUrls[index]]['date'], resource[fileUrls[index]]['description'], resource[fileUrls[index]]['uploaderUsername'], )}

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
                        <div className="lg:px-[0.3em] flex flex-wrap gap-4 justify-around">
                        {data.resources && filter==='resources' && data.resources.map((resource, index) => (
                            // {console.log(base_url + fileUrls[index], resource[fileUrls[index]]['level'], resource[fileUrls[index]]['title'], resource[fileUrls[index]]['date'], resource[fileUrls[index]]['description'], resource[fileUrls[index]]['uploaderUsername'], )}

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
                    <div className="text-xl font-crimson text-gray-300 w-[100%] fixed left-[25%] md:left-[40%] lg:left-[50%] font-medium top-[50%]"> No matching resource was found</div>
                    )}
                    {filter==='all' && data.posts && data.posts.length!==0 && <div className="mt-4">
                    {<div className="mb-2 ml-6 font-serif text-lg text-gray-400">
                                    <span>Posts</span>
                        </div>}
                        {data.posts && filter==='all' && data.posts.map((post, index) => (
                        <PostSearch
                            key={index}
                            upvotes={post?.upvotes?.length}
                            downvotes={post?.downvotes?.length}
                            comments={post?.comments?.length}
                            isVerified={post?.user?.isVerified}
                            text={post?.text}
                            name={post?.user?.name}
                            username={post?.user?.username}
                            avatar={post.user.profilePicture}
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
                    <div className="text-xl font-crimson text-gray-300 w-[100%] fixed left-[25%] md:left-[40%] lg:left-[50%] font-medium top-[50%]"> No matching post was found</div>
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
            <div className="text-xl font-crimson text-gray-300 w-[100%] fixed left-[50%] font-medium top-[40%]">
                Loading...
            </div>
        )
    }
    };

export default Search;
