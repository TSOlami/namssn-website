import axios from "axios";
import { getToken } from "./getToken";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function getPosts(page, pageSize) {
	try {
		const token = await getToken(); // Retrieve the user's token
		const headers = {
		Authorization: `Bearer ${token}`,
		};

		console.log("Token: ", token)

		const { data, status } = await axios.get(`/api/v1/users/posts?page=${page}&pageSize=${pageSize}`, { headers });
		console.log("Data from getPosts api call: ", data, status);
		if (status === 200) {
			if (data.posts.length === 0) {
				return { noMorePosts: true };
			}
			return Promise.resolve(data);
		}
		return Promise.reject(data);
	} catch (error) {
		return Promise.reject(error);
	}
}
