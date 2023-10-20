import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function getAllBlog() {
	try {
		await axios.get('/api/v1/users/blogs');
	} catch (error) {
		return Promise.reject(error);
		
	}
}