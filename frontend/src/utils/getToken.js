// Function to get the user's token (e.g., from a cookie or localStorage)
export async function getToken() {
  if (typeof document === 'undefined') {
      // Handle the case where the document object is not available
      return null;
  }

  // Retrieve the user's token by the cookie name ('jwt')
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('jwt='))
    ?.split('=')[1];
  return token || null;   
}