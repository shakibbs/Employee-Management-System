import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const getRoleDisplay = (role) => {
        // Handle both with and without ROLE_ prefix
        const cleanRole = role?.replace('ROLE_', '');
        switch (cleanRole) {
            case "ADMIN":
                return "Administrator";
            case "HR":
                return "HR Manager";
            case "USER":
            case "EMPLOYEE":
                return "Employee";
            default:
                return cleanRole || role;
        }
    };

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="text-xl font-bold text-indigo-600">EMS System</div>
            
            {user && (
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-medium">{user.username}</div>
                                <div className="text-xs text-gray-500">{getRoleDisplay(user.role)}</div>
                            </div>
                        </div>
                        <svg
                            className={`w-4 h-4 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                <div className="font-medium">{user.username}</div>
                                <div className="text-gray-500">{user.email || "No email"}</div>
                                <div className="text-xs text-gray-400 mt-1">{getRoleDisplay(user.role)}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
