import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function verifyOTP(username, code) {
    try {
        const requestData = {
            username,
            code,
          };
        const { data, status } = await axios.post('/api/v1/users/verify-otp', requestData);
        return { data, status };
    } catch (error) {
        return Promise.reject({ error });
    }
}