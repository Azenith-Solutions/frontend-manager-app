import axios from "axios";

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE || "/api/v2";
const API_V2_URL_BASE = API_URL_BASE.replace(/\/v\d+$/, "/v2");
const AI_API_URL_BASE = import.meta.env.VITE_AI_API_URL || "http://localhost:8090/v2";

export const api = axios.create({
    baseURL: API_URL_BASE,
});

export const apiV2 = axios.create({
    baseURL: API_V2_URL_BASE,
});

// Standalone Python AI chatbot microservice. Independent from the Java backend.
export const apiAi = axios.create({
    baseURL: AI_API_URL_BASE,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
        config.headers['Authorization'] = `Bearer ${parsedToken}`;
        console.log('Using token:', parsedToken);
    }
    
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

apiV2.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
        config.headers['Authorization'] = `Bearer ${parsedToken}`;
    }

    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/';
        }

        return Promise.reject(error);
    }
);

apiV2.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/';
        }

        return Promise.reject(error);
    }
);