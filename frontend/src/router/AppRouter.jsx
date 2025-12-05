import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, Suspense } from "react";
import { AuthContext } from "../context/AuthContext";

// Layouts
import ProtectedLayout from "../components/layout/ProtectedLayout";
import EmployeeProtectedLayout from "../components/layout/EmployeeProtectedLayout";

// Pages
import Login from "../pages/login/login";
import EmployeeLogin from "../pages/login/EmployeeLogin";
import Dashboard from "../pages/dashboard/Dashboard";

// Employees
import EmployeeList from "../pages/employees/EmployeeList";
import EmployeeAdd from "../pages/employees/EmployeeAdd";
import EmployeeEdit from "../pages/employees/EmployeeEdit";
import EmployeeDashboard from "../pages/employees/EmployeeDashboard";
import EmployeeProfile from "../pages/employees/EmployeeProfile";
import EmployeeAttendance from "../pages/employees/EmployeeAttendance";
import LeaveRequestForm from "../pages/employees/LeaveRequestForm";
import MyLeaveRequests from "../pages/employees/MyLeaveRequests";
import LeaveManagement from "../pages/leave/LeaveManagement";

// Users
import UserList from "../pages/users/UserList";
import UserAdd from "../pages/users/UserAdd";
import UserEdit from "../pages/users/UserEdit";

// Departments
import DepartmentList from "../pages/departments/DepartmentList";
import DepartmentAdd from "../pages/departments/DepartmentAdd";
import DepartmentEdit from "../pages/departments/DepartmentEdit";

// Attendance & Leave
import AttendanceList from "../pages/attendance/AttendanceList";
import AttendanceAdd from "../pages/attendance/AttendanceAdd";
import AttendanceEdit from "../pages/attendance/AttendanceEdit";
import LeaveRequests from "../pages/attendance/LeaveRequests";

// Notifications
import NotificationList from "../pages/notification/NotificationList";
import NotificationSend from "../pages/notification/NotificationSend";

export default function AppRouter() {
    const { user } = useContext(AuthContext);

    // Protect routes
    const RequireAuth = ({ children, requiredRoles = [] }) => {
        if (!user) return <Navigate to="/login" />;
        
        // Check if user has the required role (handle both with and without ROLE_ prefix)
        const userRole = user.role;
        const hasRequiredRole = requiredRoles.length === 0 ||
            requiredRoles.some(role => {
                // Check both formats (e.g., 'ADMIN' and 'ROLE_ADMIN')
                return userRole === role || userRole === `ROLE_${role}` || userRole.replace('ROLE_', '') === role;
            });
        
        if (requiredRoles.length > 0 && !hasRequiredRole) {
            // Redirect to appropriate dashboard based on user role
            if (userRole === 'ROLE_EMPLOYEE' || userRole === 'EMPLOYEE' || userRole === 'ROLE_USER' || userRole === 'USER') {
                return <Navigate to="/employee-dashboard" />;
            }
            return <Navigate to="/" />;
        }
        
        return children;
    };

    // Loading component for suspense
    const PageLoader = () => (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                {/* Login */}
                <Route path="/login" element={<Login />} />
                <Route path="/employee-login" element={<EmployeeLogin />} />

                {/* Dashboard - Route based on user role */}
                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            {user?.role === 'ROLE_EMPLOYEE' || user?.role === 'ROLE_USER' ? (
                                <EmployeeProtectedLayout>
                                    <EmployeeDashboard />
                                </EmployeeProtectedLayout>
                            ) : (
                                <ProtectedLayout>
                                    <Dashboard />
                                </ProtectedLayout>
                            )}
                        </RequireAuth>
                    }
                />

                {/* Employees */}
                <Route
                    path="/employees"
                    element={
                        <RequireAuth requiredRoles={['ADMIN', 'HR']}>
                            <ProtectedLayout>
                                <EmployeeList />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/employees/add"
                    element={
                        <RequireAuth requiredRoles={['ADMIN', 'HR']}>
                            <ProtectedLayout>
                                <EmployeeAdd />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/employees/:id/edit"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <EmployeeEdit />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />

                {/* Employee Self-Service */}
                <Route
                    path="/employee-dashboard"
                    element={
                        <RequireAuth requiredRoles={['EMPLOYEE', 'USER']}>
                            <EmployeeProtectedLayout>
                                <EmployeeDashboard />
                            </EmployeeProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/my-profile"
                    element={
                        <RequireAuth requiredRoles={['EMPLOYEE', 'USER']}>
                            <EmployeeProtectedLayout>
                                <EmployeeProfile />
                            </EmployeeProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/my-attendance"
                    element={
                        <RequireAuth requiredRoles={['EMPLOYEE', 'USER']}>
                            <EmployeeProtectedLayout>
                                <EmployeeAttendance />
                            </EmployeeProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/leave-request"
                    element={
                        <RequireAuth requiredRoles={['EMPLOYEE', 'USER']}>
                            <EmployeeProtectedLayout>
                                <LeaveRequestForm />
                            </EmployeeProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/my-leave-requests"
                    element={
                        <RequireAuth requiredRoles={['EMPLOYEE', 'USER']}>
                            <EmployeeProtectedLayout>
                                <MyLeaveRequests />
                            </EmployeeProtectedLayout>
                        </RequireAuth>
                    }
                />

                {/* Users */}
                <Route
                    path="/users"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <UserList />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/users/add"
                    element={
                        <RequireAuth requiredRoles={['ADMIN']}>
                            <ProtectedLayout>
                                <UserAdd />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/users/:id/edit"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <UserEdit />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />

                {/* Departments */}
                <Route
                    path="/departments"
                    element={
                        <RequireAuth requiredRoles={['ADMIN', 'HR']}>
                            <ProtectedLayout>
                                <DepartmentList />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/departments/add"
                    element={
                        <RequireAuth requiredRoles={['ADMIN', 'HR']}>
                            <ProtectedLayout>
                                <DepartmentAdd />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/departments/:id/edit"
                    element={
                        <RequireAuth requiredRoles={['ADMIN', 'HR']}>
                            <ProtectedLayout>
                                <DepartmentEdit />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />

                {/* Attendance */}
                <Route
                    path="/attendance"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <AttendanceList />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/attendance/add"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <AttendanceAdd />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/attendance/:id/edit"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <AttendanceEdit />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/attendance/leave"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <LeaveRequests />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/leave-management"
                    element={
                        <RequireAuth requiredRoles={['ADMIN', 'HR']}>
                            <ProtectedLayout>
                                <LeaveManagement />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />

                {/* Notifications */}
                <Route
                    path="/notifications"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <NotificationList />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/notifications/send"
                    element={
                        <RequireAuth>
                            <ProtectedLayout>
                                <NotificationSend />
                            </ProtectedLayout>
                        </RequireAuth>
                    }
                />

                    {/* Redirect any unknown route to dashboard */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Suspense>
        </Router>
    );
}
