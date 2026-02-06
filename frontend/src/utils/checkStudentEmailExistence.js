import apiClient from './apiClient';

export async function checkStudentEmailExistence(studentEmail) {
  try {
    const response = await apiClient.post('/api/v1/users/check-student-email', { studentEmail });
    return response.data.exists; // Assuming your API returns an object with an 'exists' property
  } catch (error) {
    console.error('Error checking student email existence:', error);
    return false;
  }
}
