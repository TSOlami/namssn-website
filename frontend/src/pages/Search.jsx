import Select from 'react-select';
import { useEffect, useState } from "react";
import { Post, ResourceCard } from "../components";
import { HeaderComponent, Sidebar, UserCard } from "../components";
import { formatDateToTime } from "../utils";
import { UserListSkeleton, ResourceListSkeleton, PostListSkeleton } from "../components/skeletons";
import { getResourcesUrl } from "../config/api";
import { useSearchQuery } from "../redux";

const Search = () => {
  const [value, setValue] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryValue = params.get('key');
    if (queryValue) setValue(queryValue);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filterValue = params.get('filter');
    if (filterValue) setFilter(filterValue);
  }, []);

  const skip = !filter || !value;
  const { data, isLoading, isError, refetch } = useSearchQuery({ filter, value }, { skip });

  const handleClick = (val) => {
    window.location.href = `/search?key=${value}&filter=${val}`;
  };

  const handleReload = () => refetch();

const borderStyle = "border-b-[2px] border-blue-400"
const unselectBorderStyle = "border-b-[1px] border-gray-400"
    
if (data && !isError && Object.keys(data).length !== 0) {
    const resources = Array.isArray(data?.resources) ? data.resources : [];

const handleChange = (val) => {
    localStorage.setItem('selectedFilter', val.value)
    handleClick(val.value)
}
const selectedFilter = localStorage.getItem('selectedFilter')
const customStyles = {
    option: (provided, state) => ({
        ...provided,
        borderLeft: state.value===selectedFilter ? '2px solid blue' : '',
        color: state.isSelected ? 'blue' : 'black',
        font: 'serif',
    }),
    };
const options = [
    { value: 'all', label: 'All' },
    { value: 'users', label: 'Users' },
    { value: 'resources', label: 'Resources' },
    { value: 'posts', label: 'Posts' }
];

return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-col sm:w-full md:w-[80%]">
                <div className="sticky top-[0.01%] z-[300] bg-white">
                    <HeaderComponent title="SEARCH" url={"Placeholder"} />
                </div>
                
                {isLoading && (
                    <div className="p-4 space-y-6">
                        {(filter === 'all' || filter === 'users') && (
                            <div>
                                <div className="h-6 bg-gray-200 rounded w-20 mb-4 animate-pulse" />
                                <UserListSkeleton count={3} />
                            </div>
                        )}
                        {(filter === 'all' || filter === 'resources') && (
                            <div>
                                <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
                                <ResourceListSkeleton count={4} />
                            </div>
                        )}
                        {(filter === 'all' || filter === 'posts') && (
                            <div>
                                <div className="h-6 bg-gray-200 rounded w-16 mb-4 animate-pulse" />
                                <PostListSkeleton count={3} />
                            </div>
                        )}
                    </div>
                )}
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
                {!isLoading && filter==='all' && data.users && data.users.length!==0 && <div className="ml-6 mt-8">
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
                {!isLoading && !isError && filter==='users' && data?.users && data.users.length!==0 ? (<div className="ml-6 mt-8">
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
                {!isLoading && filter==='all' && resources.length > 0 && <div className="ml-6 mt-4">
                    <div className="font-serif text-lg text-gray-400">
                        <span>Resources</span>
                    </div>
                    <div className="lg:px-[0.3em] flex flex-wrap gap-4 justify-around">
                    {resources.map((resource, index) => {
                        const fileKey = Object.keys(resource || {})[0];
                        const item = fileKey ? resource?.[fileKey] : null;
                        if (!fileKey || !item) return null;
                        const base = (getResourcesUrl() ?? '/api/v1/users/resources/').replace(/\/$/, '');
                        const isLarge = item?.isLarge ?? false;
                        const fileUrl = isLarge ? fileKey : `${base}/${fileKey}+${encodeURIComponent(item?.title ?? '')}`;
                        const fileUrl2 = isLarge ? fileKey : undefined;
                        return (
                        <ResourceCard key={index} fileUrl={fileUrl} fileUrl2={fileUrl2} description={item?.description}
                        uploaderUsername={item?.uploaderUsername} uploaderId={item?.uploaderId}
                        title={item?.title ?? fileKey ?? "resource"}
                        date={item?.date ? formatDateToTime(new Date(item.date)) : ''}
                        semester={item?.semester ?? item?.level} course={item?.course} isLarge={isLarge}
                        />
                        );
                    })}
                    </div>
                </div>}
                {!isLoading && !isError && filter==='resources' && resources.length > 0 ? (<div className="ml-6 mt-4">
                    <div className="font-serif text-lg text-gray-400">
                        <span>Resources</span>
                    </div>
                    <div className="lg:px-[0.3em] flex flex-wrap gap-4 justify-around">
                    {resources.map((resource, index) => {
                        const fileKey = Object.keys(resource || {})[0];
                        const item = fileKey ? resource?.[fileKey] : null;
                        if (!fileKey || !item) return null;
                        const base = (getResourcesUrl() ?? '/api/v1/users/resources/').replace(/\/$/, '');
                        const isLarge = item?.isLarge ?? false;
                        const fileUrl = isLarge ? fileKey : `${base}/${fileKey}+${encodeURIComponent(item?.title ?? '')}`;
                        const fileUrl2 = isLarge ? fileKey : undefined;
                        return (
                        <ResourceCard key={index} fileUrl={fileUrl} fileUrl2={fileUrl2} description={item?.description}
                        uploaderUsername={item?.uploaderUsername} uploaderId={item?.uploaderId}
                        title={item?.title ?? fileKey ?? "resource"}
                        date={item?.date ? formatDateToTime(new Date(item.date)) : ''}
                        semester={item?.semester ?? item?.level} course={item?.course} isLarge={isLarge}
                        />
                        );
                    })}
                    </div>
                </div>) : !isLoading && filter==='resources' && (
                <div className="flex flex-col items-center relative top-[13em]">
                    <div><span className="font-serif sm:text-md lg:text-lg text-gray-400"> No matching resource </span></div>
                </div>
                )}
                {!isLoading && !isError && filter==='all' && data?.posts && data.posts.length!==0 && <div className="mt-4">
                {<div className="mb-2 ml-6 font-serif text-lg text-gray-400">
                                <span>Posts</span>
                    </div>}
                    {data.posts && filter==='all' && data.posts.map((post) => (
                    <Post
                        key={post?._id}
                        post={post}
                        updatePostData={() => {}}
                        removePost={() => {}}
                    />
                ))}
                </div>}
                {filter==='posts' && data.posts && data.posts.length!==0 ? (<div className="mt-4 pt-0">
                {<div className="mb-2 ml-6 font-serif text-lg text-gray-400">
                                <span>Posts</span>
                    </div>}
                    {data.posts && filter==='posts' && data.posts.map((post) => (
                    <Post
                        key={post?._id}
                        post={post}
                        updatePostData={() => {}}
                        removePost={() => {}}
                    />
                ))}
                </div>) : !isLoading && !isError && filter==='posts' && (
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
    
} else if (isError) {
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
} else if (data && Object.keys(data).length === 0) {
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
} else {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex w-[100%] flex-col">
                <div className="sticky top-[0.01%] z-[300] bg-white">
                    <HeaderComponent title="SEARCH" url={"Placeholder"} />
                </div>
                <div className="p-4 space-y-6">
                    <UserListSkeleton count={2} />
                    <ResourceListSkeleton count={3} />
                    <PostListSkeleton count={2} />
                </div>
            </div>
        </div>
    )}
};

export default Search;
