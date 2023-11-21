import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function verifyPasswordOTP(username, code) {
    try {
        const { data, status } = await axios.post('/api/v1/users/verify-otp', { username, code });
        return { data, status };
    } catch (error) {
        return Promise.reject({ error });
    }
}