import axios from 'axios';

const API = axios.create({
    baseURL: '/api'
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('shopez_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses (token expired etc.)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('shopez_token');
            localStorage.removeItem('shopez_user');
            // Don't redirect on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default API;
