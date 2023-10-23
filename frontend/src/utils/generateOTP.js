import axios from "axios";

import { getUser } from "./getUser";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function generateOTP(username) {
	try {
		console.log(username)
		const {data: {code}, status} = await axios.get('/api/v1/users/generate-otp', { params: { username } });

		console.log("Data from generate OTP api call: ", code, status);

		// If the request was successful, send mail with OTP
		if (status === 201) {
			let { data: {email}} = await getUser({ username });
			let text = `Your OTP is ${code} and is valid for 5 minutes.`;
			console.log("Sending mail with OTP...: ", code, email, text);
			await axios.post('/api/v1/users/register-mail', { username, userEmail: email, text, subject: 'OTP' });
		}
		return Promise.resolve({ code });
	} catch (error) {
		return Promise.reject({ error });
	}
}