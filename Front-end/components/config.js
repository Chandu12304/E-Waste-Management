import axios from 'axios';

export const BASE_URL = "https://e-waste-management-org9.onrender.com";

// Create an axios instance
const axiosInstance = axios.create();

// Add a request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;