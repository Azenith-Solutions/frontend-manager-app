import axios from "axios";
 
export const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});

// Add interceptor to request after creating the instance
api.interceptors.request.use((config) => {
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    return config;
});

// Fix the response interceptor to properly handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => { 
        // Check if error.response exists before accessing it
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/';
        }
        
        return Promise.reject(error);
    }
);