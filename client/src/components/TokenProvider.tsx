import { type ReactNode } from "react";
import { useAuthStore } from "../store/zustand";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "./Spinner";

interface TokenProviderProps {
    children: ReactNode;
}

const TokenProvider = ({ children }: TokenProviderProps) => {
    const { setAccessToken } = useAuthStore((state) => state);

    const { isLoading } = useQuery({
        queryKey: ["accessToken"],
        queryFn: async () => {
            const { data } = await axios.get("/api/auth/refresh-token");
            setAccessToken(data);
            return data;
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );

    return <div>{children}</div>;
};

export default TokenProvider;
