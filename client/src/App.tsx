import { Routes, Route, BrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthLayout from "./routes/AuthLayout";
import AdminPage from "./pages/AdminPage";
import NonAdminPage from "./pages/NonAdminPage";
import AdminLayout from "./routes/AdminLayout";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<AuthLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/non-admin" element={<NonAdminPage />} />
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<AdminPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
