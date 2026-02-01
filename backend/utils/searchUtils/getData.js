import createFileList from "../resourcesUtils/createFileList.js";
import {searchUsers, searchPosts, searchResources} from "./searchBy.js";

const getData = async (value, filter) => {
    const data = {}
    if (filter === "all") {
        const users = await searchUsers(value);
        if (users && users.length !== 0) {
            data['users'] = users;
        }
        const posts = await searchPosts(value);
        if (posts && posts.length !== 0) {
            data['posts'] = posts;
        }
        const resources = await searchResources(value);
        if (resources && resources.length !== 0) {
            const formattedResources = await createFileList(resources);
            data['resources'] = formattedResources
        }
        return data
    } else {
        switch (filter) {
            case 'users':
                const users = await searchUsers(value);
                data['users'] = users;
                break;
            case 'resources':
                const resources = await searchResources(value);
                const formattedResources = await createFileList(resources);
                data['resources'] = formattedResources
                break;
            case 'posts':
                const posts = await searchPosts(value);
                data['posts'] = posts;
                break;
        }
        return data
    }
}

export default getData;