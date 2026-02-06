import apiClient from "./apiClient";
import { getToken } from "./getToken";

export async function getPosts(page, pageSize) {
	try {
		const token = await getToken(); // Retrieve the user's token
		const headers = {
		Authorization: `Bearer ${token}`,
		};


		const { data, status } = await apiClient.get(`/api/v1/users/posts?page=${page}&pageSize=${pageSize}`, { headers });
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
