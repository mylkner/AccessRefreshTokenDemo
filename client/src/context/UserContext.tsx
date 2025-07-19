import { createContext, useContext, useState, type Dispatch } from "react";

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
