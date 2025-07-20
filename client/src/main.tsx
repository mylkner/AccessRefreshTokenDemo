import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TokenProvider from "./components/TokenProvider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            <TokenProvider>
                <App />
            </TokenProvider>
        </QueryClientProvider>
    </StrictMode>
);
