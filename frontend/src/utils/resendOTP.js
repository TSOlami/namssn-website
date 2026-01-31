import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function resendOTP(username) {
	try {
		const { data, status } = await axios.get(`/api/v1/users/resend-otp/${username}`);

		if (status === 201) {
			return Promise.resolve({ message: data.message });
		}
		return Promise.resolve({ message: 'OTP resent successfully' });
	} catch (error) {
		return Promise.reject({ error });
	}
}