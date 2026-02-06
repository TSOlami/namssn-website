import apiClient from './apiClient';

export async function getAllBlog() {
	try {
		const { data } = await apiClient.get('/api/v1/users/blogs');
		return { data }
	} catch (error) {
		return {error};
		
	}
}