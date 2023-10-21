import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function verifyAccount(username, studentEmail) {
  try {
    // Make the API call to verify the account
    const { data, status } = await axios.post('/api/v1/users/verify-account', { username, studentEmail });

    if (status === 200) {
      // Account verification was successful
      return { data };
    } else {
      // Handle any error or failed account verification here
      return { error: 'Failed to verify account' };
    }
  } catch (error) {
    // Handle any unexpected errors here
    return { error: 'An error occurred while verifying the account' };
  }
}
