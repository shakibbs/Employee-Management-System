import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL; // fallback to support both

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    // Skip token for auth endpoints
    if (config.url && config.url.includes('/auth/')) {
        return config;
    }
    
    if (typeof window !== "undefined" && window.localStorage) {
        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear it and redirect to login
            if (typeof window !== "undefined" && window.localStorage) {
                localStorage.removeItem(process.env.REACT_APP_TOKEN_KEY);
            }
            if (typeof window !== "undefined") {
                // Use replaceState instead of href to avoid history.pushState warning
                window.history.replaceState(null, '', '/login');
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
