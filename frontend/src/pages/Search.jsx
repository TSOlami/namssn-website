import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Resources from "./Resources";
import store from "../redux/store/store";
import { Post } from "../components";
import ResourceSearch from "./resourceSearch";
import {HeaderComponent, Sidebar} from "../components";

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

    const newPosts = []
    posts.map((post, index) => {
        if (post.text.toLowerCase().includes(value.toLowerCase())) {
            newPosts.push(post)
        }
    })

    return (
        <div className="flex ">
			<Sidebar/>
			<div className="flex flex-col relative">
				<HeaderComponent title="Home"/>
                <ResourceSearch query={value}/>
                <>
                {newPosts?.map((post) => {
                return (
                    <Post
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
                    />
              );
            })}
          </>
          </div>
        </div>
    )       
};

export default Search;
