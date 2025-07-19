import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useState, type Dispatch } from "react";
import Spinner from "../components/Spinner";

interface AuthContextProps {
    accessToken: string | null;
    setAccessToken: Dispatch<React.SetStateAction<string | null>>;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const { isLoading } = useQuery({
        queryKey: ["checkAuth"],
        queryFn: async () => {
            const { data } = await axios.get("/api/auth/refresh-token", {
                withCredentials: true,
            });
            setAccessToken(data);
            return data;
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null)
        throw new Error("AuthContext must be used within an AuthProvider");
    return context;
};
