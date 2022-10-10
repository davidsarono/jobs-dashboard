import axios from 'axios';
const instance = axios.create();

instance.defaults.baseURL = import.meta.env.VITE_API_URL
instance.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default instance;
