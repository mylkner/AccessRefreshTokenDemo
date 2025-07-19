import { createContext, useContext, useState, type Dispatch } from "react";

interface AuthContextProps {
    accessToken: string | null;
    setAccessToken: Dispatch<React.SetStateAction<string | null>> | null;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
    accessToken: null,
    setAccessToken: null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
