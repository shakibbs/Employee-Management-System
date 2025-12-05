import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function ProtectedLayout({ children }) {
    const { isAuthenticated, loading, user } = useContext(AuthContext);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Redirect to appropriate login page if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Redirect employees to employee login if they somehow access admin routes
    // Check for both EMPLOYEE and USER roles (with and without ROLE_ prefix)
    const isEmployee = user?.role === 'EMPLOYEE' || user?.role === 'ROLE_EMPLOYEE' ||
                       user?.role === 'USER' || user?.role === 'ROLE_USER';
    
    if (isEmployee) {
        return <Navigate to="/employee-login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
