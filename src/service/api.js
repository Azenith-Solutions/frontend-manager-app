import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
        config.headers['Authorization'] = `Bearer ${parsedToken}`;
        console.log('Using token:', parsedToken);
    }

    // If the request data is FormData, delete the Content-Type header.
    // This allows the browser to set it correctly with the boundary.
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