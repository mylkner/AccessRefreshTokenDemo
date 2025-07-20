import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/zustand";

const AuthLayout = () => {
    const { accessToken } = useAuthStore((state) => state);
    return !accessToken ? <Navigate to="/" /> : <Outlet />;
};

export default AuthLayout;
