import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function verifyAccount(username, studentEmail) {
  try {
    // Make the API call to verify the account
    const { data, status } = await axios.post('/api/v1/users/verify-account', { username, studentEmail });

    if (status === 200) {
      // Account verification was successful
      const text = 'Congratulations on verifying your account at NAMSSN, FUTMINNA chapter! You are now an official member of our community. Enjoy the benefits and stay connected!'
      // Send a congratulatory email using the same registerMail function
      await axios.post('/api/v1/users/register-mail', { username, userEmail: studentEmail, text, subject: 'Account Verification successful' });
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
