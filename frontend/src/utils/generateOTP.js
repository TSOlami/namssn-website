import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function generateOTP(username) {
	try {
		// Server now sends OTP via email directly - no code returned for security
		const { data, status } = await axios.get(`/api/v1/users/generate-otp/${username}`);

		if (status === 201) {
			return Promise.resolve({ message: data.message });
		}
		return Promise.resolve({ message: 'OTP sent successfully' });
	} catch (error) {
		return Promise.reject({ error });
	}
}