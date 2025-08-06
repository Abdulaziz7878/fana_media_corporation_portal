import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Attach token to request
axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('fmc_user'));
  if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle token expiry or unauthorized access
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if ((status === 401 || status === 403) && error.response?.data?.message !== 'Invalid password' && error.response?.data?.message !== 'Invalid username' && error.response?.data?.message !== 'Server error' && error.response?.data?.message !== 'Current password is incorrect' && error.response?.data?.message !== 'No token provided' && error.response?.data?.message !== 'Invalid token') {
  alert("Session expired. Please log in again.");
  setTimeout(() => {
    localStorage.removeItem('fmc_user');
    window.location.href = '/';
  }, 1000);
}

    return Promise.reject(error);
  }
);

export default axiosInstance;