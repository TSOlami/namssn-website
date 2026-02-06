import apiClient from "./apiClient";

export async function resetPassword(username, password) {
	try {
		const { data, status } = await apiClient.put('/api/v1/users/reset-password', { username, password });
		return Promise.resolve({ data, status });
	} catch (error) {
		return Promise.reject({ error });
	}
}
