import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Resources from "./Resources";
import store from "../redux/store/store";
import { PostSearch, ResourceCard,ResourceSearch } from "../components";
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
            console.log(filterValue)
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (filter && value) {
                try {
                    const res = await axios.get(`http://localhost:5000/api/v1/users/search?filter=${filter}&value=${value}`);
                    if (res) {
                        console.log(res);
                        setData(res.data); // set the fetched data to the state
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        };
        fetchData(); // call the fetchData function
    }, [filter, value]);

    if (data) {
        let fileUrls = []
        if (data.resources) {
            fileUrls = [...new Set(data.resources.flatMap(obj => Object.keys(obj)))]
            console.log(data.resources)
            // console.log(fileUrls)
        }
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex flex-col relative">
                    <HeaderComponent title="SEARCH" />
                    {data.users && data.users.map((user, index) => (
                        <UserCard key={index} name={user.name} u_id={user._id}
                        username={user.username} isVerified={user.isVerified}
                        avatar={user.image}
                        />
                    ))}
                    {data.resources && data.resources.map((resource, index) => (
                        // {console.log(base_url + fileUrls[index], resource[fileUrls[index]]['level'], resource[fileUrls[index]]['title'], resource[fileUrls[index]]['date'], resource[fileUrls[index]]['description'], resource[fileUrls[index]]['uploaderUsername'], )}

                        <ResourceCard key={index} fileUrl={base_url + fileUrls[index]} description={resource[fileUrls[index]]['description']}
                        uploaderUsername = {resource[fileUrls[index]]['uploaderUsername']}
                        title = {resource[fileUrls[index]]['title']}
                        date = {formatDateToTime(new Date(resource[fileUrls[index]]['date']))}
                        semester = {resource[fileUrls[index]]['level']}
                        course = {resource[fileUrls[index]]['course']}
                        />
                    ))}
                    {data.posts && data.posts.map((post, index) => (
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
                </div>
            </div>
        )
        
    }
    };

export default Search;
