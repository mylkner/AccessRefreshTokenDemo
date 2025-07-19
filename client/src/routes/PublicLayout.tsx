import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/UserContext";

const PublicLayout = () => {
    const { accessToken } = useAuth();
    return accessToken ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicLayout;
