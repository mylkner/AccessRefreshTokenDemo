import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/zustand";

const PublicLayout = () => {
    const { accessToken } = useAuthStore((state) => state);
    return accessToken ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicLayout;
