import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function getAllBlog() {
	try {
		const { data } = await axios.get('/api/v1/users/blogs');
		return { data }
	} catch (error) {
		return {error};
		
	}
}