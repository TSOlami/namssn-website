import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export async function checkStudentEmailExistence(studentEmail) {
  try {
    const response = await axios.post('/api/v1/users/check-student-email', { studentEmail });
    return response.data.exists; // Assuming your API returns an object with an 'exists' property
  } catch (error) {
    console.error('Error checking student email existence:', error);
    return false;
  }
}
