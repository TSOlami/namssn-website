import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function sendMailNotice({ sendTo, subject, text, selectedLevel }) {
	try {
		const { status } = await axios.post('/api/v1/admin/notice-mail', { sendTo, subject, text, selectedLevel });
		return Promise.resolve({ status });
	} catch (error) {
		return Promise.reject({ error });
	}
}