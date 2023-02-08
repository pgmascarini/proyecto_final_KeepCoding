import axios from "axios";

const useApi = () => {
    const api = axios.create({
        baseURL: "/api",
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");

        if (token) {
            (config.headers).set(
                "Authorization",
                `Bearer ${token}`
            );
        }

        return config;
    });

    return api;
}

export default useApi;