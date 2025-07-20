import axios from "axios";
import { useAuthStore } from "../store/zustand";

const axiosInstance = axios.create({
    baseURL: "/",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const setAccessToken = useAuthStore.getState().setAccessToken;
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data: accessToken } = await axios.get(
                    "/api/auth/refresh-token",
                    { withCredentials: true }
                );
                setAccessToken(accessToken);

                return await axiosInstance(originalRequest);
            } catch (refreshError) {
                setAccessToken(null);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
