import apiClient from "./apiClient";

export async function verifyPasswordOTP(username, code) {
    try {
        const { data, status } = await apiClient.post('/api/v1/users/verify-otp', { username, code });
        return { data, status };
    } catch (error) {
        return Promise.reject({ error });
    }
}