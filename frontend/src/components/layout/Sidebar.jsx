import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FiUsers, FiHome, FiFileText, FiMail, FiLogOut, FiCalendar, FiUser } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-2 p-2 rounded hover:bg-indigo-100 ${
            isActive ? "bg-indigo-200 font-semibold" : ""
        }`;

    return (
        <div className="w-64 bg-white shadow-md min-h-screen p-4 flex flex-col justify-between">
            <div className="space-y-2">
                {/* Helper function to check roles */}
                {(() => {
                    const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';
                    const isHR = user?.role === 'HR' || user?.role === 'ROLE_HR';
                    const isEmployee = user?.role === 'EMPLOYEE' || user?.role === 'ROLE_EMPLOYEE';
                    const isUser = user?.role === 'USER' || user?.role === 'ROLE_USER';
                    
                    return (
                        <>
                            {/* Admin/HR Dashboard */}
                            {(isAdmin || isHR) && (
                                <NavLink to="/" className={linkClasses}>
                                    <FiHome /> Dashboard
                                </NavLink>
                            )}
                               
                            {/* Admin/HR only routes */}
                            {(isAdmin || isHR) && (
                                <>
                                    <NavLink to="/employees" className={linkClasses}>
                                        <FiUsers /> Employees
                                    </NavLink>
                                    <NavLink to="/employees/add" className={linkClasses}>
                                        <FiUsers /> Add Employee
                                    </NavLink>
                                </>
                            )}
                            
                            {/* Admin only routes */}
                            {isAdmin && (
                                <>
                                    <NavLink to="/users" className={linkClasses}>
                                        <FiUsers /> Users
                                    </NavLink>
                                    <NavLink to="/departments" className={linkClasses}>
                                        <FiFileText /> Departments
                                    </NavLink>
                                </>
                            )}
                            
                            {/* Admin/HR routes */}
                            {(isAdmin || isHR) && (
                                <>
                                    <NavLink to="/attendance" className={linkClasses}>
                                        <FiFileText /> Attendance
                                    </NavLink>
                                    <NavLink to="/attendance/leave" className={linkClasses}>
                                        <FiCalendar /> Attendance Leave
                                    </NavLink>
                                    <NavLink to="/leave-management" className={linkClasses}>
                                        <FiCalendar /> Leave Management
                                    </NavLink>
                                    <NavLink to="/notifications" className={linkClasses}>
                                        <FiMail /> Notification Logs
                                    </NavLink>
                                    <NavLink to="/notifications/send" className={linkClasses}>
                                        <FiMail /> Send Notification
                                    </NavLink>
                                </>
                            )}
                            
                            {/* Employee self-service routes */}
                            {(isEmployee || isUser) && (
                                <>
                                    <NavLink to="/employee-dashboard" className={linkClasses}>
                                        <FiHome /> Dashboard
                                    </NavLink>
                                    <NavLink to="/my-profile" className={linkClasses}>
                                        <FiUser /> My Profile
                                    </NavLink>
                                    <NavLink to="/my-attendance" className={linkClasses}>
                                        <FiFileText /> My Attendance
                                    </NavLink>
                                    <NavLink to="/leave-request" className={linkClasses}>
                                        <FiCalendar /> Request Leave
                                    </NavLink>
                                </>
                            )}
                        </>
                    );
                })()}
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 rounded hover:bg-red-100 text-red-600 mt-4"
            >
                <FiLogOut /> Logout
            </button>
        </div>
    );
}
