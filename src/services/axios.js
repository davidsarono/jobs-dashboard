import axios from 'axios';
const instance = axios.create();

instance.defaults.baseURL = import.meta.env.VITE_API_URL
instance.interceptors.request.use(function (config) {
    if (!config.url) {
        return config;
    }

    const currentUrl = new URL(config.url, config.baseURL);
    Object.entries(config.urlParams || {}).forEach(([k, v,]) => {
        currentUrl.pathname = currentUrl.pathname.replace(`:${k}`, encodeURIComponent(v));
    });

    return { ...config, url: currentUrl.pathname }
}, function (error) {
    return Promise.reject(error);
});

export default instance;
