import apiClient from "./apiClient";

export async function resendOTP(username) {
	try {
		const { data, status } = await apiClient.get(`/api/v1/users/resend-otp/${username}`);

		if (status === 201) {
			return Promise.resolve({ message: data.message });
		}
		return Promise.resolve({ message: 'OTP resent successfully' });
	} catch (error) {
		return Promise.reject({ error });
	}
}