import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function verifyOTP(username, code) {
	try {
		const { data, status } = await axios.get('/api/v1/users/verify-otp', { params: { username, code } });
		return { data, status };
	} catch (error) {
		return Promise.reject({ error });
	}
}