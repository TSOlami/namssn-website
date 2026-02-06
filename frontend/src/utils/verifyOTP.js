import apiClient from "./apiClient";

export async function verifyOTP(username, code) {
    try {
        const requestData = {
            username,
            code,
          };
        const { data, status } = await apiClient.post('/api/v1/users/verify-otp', requestData);
        return { data, status };
    } catch (error) {
        return Promise.reject({ error });
    }
}