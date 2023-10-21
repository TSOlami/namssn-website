import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Resources from "./Resources";
import store from "../redux/store/store";
import { PostSearch, ResourceSearch } from "../components";
import { HeaderComponent, Sidebar } from "../components";

const state = store.getState();

const Search = () => {
    const [value, setValue] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const queryValue = params.get('key');
        if (queryValue) {
            setValue(queryValue);
            // console.log(queryValue)
        }
    }, []);

    const posts = state.auth.posts;

    const newPosts = posts.filter(post => post.text.toLowerCase().includes(value.toLowerCase()));
    console.log(newPosts);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-col relative">
                <HeaderComponent title="SEARCH" />
                <div>
                    <div className="pt-4 pl-6 text-gray-400">
                        <span className="text-lg font-serif">Resources</span>
                    </div>
                    <ResourceSearch query={value} />
                </div>
                <div>
                    <div className="pt-4 pl-6 text-gray-400">
                        <span className="text-lg font-serif">Posts</span>
                    </div>
                    {newPosts.map((post) => (
                        <PostSearch
                            key={post?._id}
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
        </div>
    )
};

export default Search;
