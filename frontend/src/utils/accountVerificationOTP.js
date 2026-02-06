import apiClient from "./apiClient";

export async function accountVerificationOTP(username, studentEmail) {
	try {
		const {data: {code}, status} = await apiClient.get(`/api/v1/users/generate-otp/${username}`);

		// If the request was successful, send mail with OTP
		if (status === 201) {
			let text = `Your 6-digit OTP is ${code} and is valid for 5 minutes.`;
			await apiClient.post('/api/v1/users/register-mail', { username, userEmail: studentEmail, text, subject: 'OTP from NAMSSN FUTMINNA' });
		}
		return Promise.resolve({ code });
	} catch (error) {
		return Promise.reject({ error });
	}
}