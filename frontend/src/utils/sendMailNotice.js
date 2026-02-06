import apiClient from "./apiClient";

export async function sendMailNotice({ sendTo, subject, text, selectedLevel }) {
	try {
		const { status } = await apiClient.post('/api/v1/admin/notice-mail', { sendTo, subject, text, selectedLevel });
		return Promise.resolve({ status });
	} catch (error) {
		return Promise.reject({ error });
	}
}