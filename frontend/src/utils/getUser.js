import apiClient from './apiClient';

export async function getUser({ username }) {
	try {
		const { data } = await apiClient.get(`/api/v1/users/user?username=${username}`);
		return { data }
	} catch (error) {
		return { error }
	}
}
