import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/UserContext";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>
);
