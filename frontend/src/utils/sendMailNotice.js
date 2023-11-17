import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function sendMailNotice({ subject, text, selectedLevel }) {
	try {
		console.log("Sending mail to all users...");
		const { status } = await axios.post('/api/v1/users/notice-mail', { subject, text, selectedLevel });
		console.log("Status from sendMailNotice api call: ", status);
		return Promise.resolve({ status });
	} catch (error) {
		return Promise.reject({ error });
	}
}