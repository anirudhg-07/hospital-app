import axios from "axios";

/**
 * Pre-configured axios instance that automatically includes
 * the JWT token in every request's Authorization header.
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

// Attach token to every outgoing request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// If token is expired/invalid, redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
