import axios from "axios";

import { getUser } from "./getUser";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function resendOTP(username) {
	try {
		const {data: {code}, status} = await axios.get(`/api/v1/users/resend-otp/${username}`);

		// If the request was successful, send mail with OTP
		if (status === 201) {
			let { data: {email}} = await getUser({ username });
			let text = `Your 6-digit OTP is ${code} and is valid for 5 minutes.`;
			await axios.post('/api/v1/users/register-mail', { username, userEmail: email, text, subject: 'OTP from NAMSSN FUTMINNA' });
		}
		return Promise.resolve({ code });
	} catch (error) {
		return Promise.reject({ error });
	}
}