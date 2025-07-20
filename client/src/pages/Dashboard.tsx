import axiosInstance from "../axios/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/zustand";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { jwtDecode, type JwtPayload } from "jwt-decode";

interface UserInfo extends JwtPayload {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

const Dashboard = () => {
    const { accessToken, setAccessToken } = useAuthStore((state) => state);
    const [res, setRes] = useState("");
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        if (accessToken !== null) {
            const user = jwtDecode<UserInfo>(accessToken);
            console.log(user.exp);
            setUserInfo({
                id: user[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ],
                username:
                    user[
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                    ],
                role: user[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ],
                expiry: user.exp
                    ? new Date(user.exp * 1000).toUTCString()
                    : null,
            });
        }
    }, [accessToken]);

    const user = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.get("/api/auth");
            return res.data;
        },
        onSuccess: (data) => setRes(data),
        onError: (error) =>
            error instanceof AxiosError
                ? setRes(error.response?.data?.detail)
                : setRes(error.message),
    });

    const admin = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.get("/api/auth/admin");
            return res.data;
        },
        onSuccess: (data) => setRes(data),
        onError: () => setRes("Forbidden"),
    });

    const changeRole = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.put("/api/auth/change-role");
            return res.data;
        },
        onSuccess: (data) => {
            setRes("Role changed.");
            setAccessToken(data);
        },
    });

    const logout = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.get("/api/auth/logout");
            return res.data;
        },
        onSuccess: () => {
            setAccessToken(null);
        },
    });

    const deleteEndpoint = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.delete("/api/auth/delete");
            return res.data;
        },
        onSuccess: () => {
            setAccessToken(null);
        },
    });

    const createButton = (content: string, fn: () => void) => {
        const buttonClass: string =
            "px-5 py-3 bg-blue-500 hover:bg-blue-700 rounded transition-colors cursor-pointer w-full disabled:bg-gray-500 disabled:cursor-default";
        return (
            <button className={buttonClass} onClick={fn}>
                {content}
            </button>
        );
    };

    return (
        <div className="text-white flex flex-col items-center gap-4 p-6 w-full h-screen">
            <p className="text-white self-start">
                Sensitive info shown is for demonstrative purposes.
            </p>
            <div className="break-all">
                <h2 className="text-2xl">Access Token</h2>
                <hr className="mb-2" />
                <p>{accessToken}</p>
            </div>

            <div className="self-start">
                <h2 className="text-2xl">User Info</h2>
                <hr className="mb-2" />
                {Object.entries(userInfo).map(([key, value]) => (
                    <p key={key}>
                        {(key == "id"
                            ? "ID"
                            : key.charAt(0).toUpperCase() + key.slice(1)) +
                            ": " +
                            String(value)}
                    </p>
                ))}
            </div>

            {createButton("User endpoint", () => user.mutate())}
            {createButton("Admin endpoint", () => admin.mutate())}
            {createButton("Change role", () => changeRole.mutate())}
            {createButton("Logout", () => logout.mutate())}
            {createButton("Delete", () => deleteEndpoint.mutate())}
            {res && <p>{res}</p>}
        </div>
    );
};

export default Dashboard;
