import apiClient from './apiClient';

export async function checkEmailExistence(email) {
  try {
    const response = await apiClient.post('/api/v1/users/check-email', { email });
    return response.data.exists; // Assuming your API returns an object with an 'exists' property
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
}
