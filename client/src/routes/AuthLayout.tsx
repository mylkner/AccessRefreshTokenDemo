import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/UserContext";

const AuthLayout = () => {
    const { accessToken } = useAuth();
    return accessToken == null ? <Navigate to="/" /> : <Outlet />;
};

export default AuthLayout;
