import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function resetPassword(username, password) {
	try {
		const { data, status } = await axios.put('/api/v1/users/reset-password', { username, password });
		return Promise.resolve({ data, status });
	} catch (error) {
		return Promise.reject({ error });
	}
}
