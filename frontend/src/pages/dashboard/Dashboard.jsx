import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardData } from "../../api/analyticsService";
import { getAllUsers } from "../../api/userService";
import { getLeaveRequests } from "../../api/attendanceService";
import { Card } from "../../components/ui";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { useToast } from "../../hooks/useToast";
import { FiUsers, FiFileText, FiCalendar, FiUserPlus, FiPlus, FiBriefcase } from "react-icons/fi";

export default function Dashboard() {
    const navigate = useNavigate();
    const [employeeCount, setEmployeeCount] = useState(0);
    const [departmentCount, setDepartmentCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0, leave: 0 });
    const [leaveCount, setLeaveCount] = useState(0);
    const [pendingLeaves, setPendingLeaves] = useState(0);
    const [recentEmployees, setRecentEmployees] = useState([]);
    const [recentAttendance, setRecentAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch optimized dashboard data
            const dashboardData = await getDashboardData();
            
            // Set employee counts
            setEmployeeCount(dashboardData.employeeCount || 0);
            setRecentEmployees(dashboardData.recentEmployees || []);
            
            // Set department count
            setDepartmentCount(dashboardData.departmentCount || 0);
            
            // Set attendance stats
            const stats = dashboardData.attendanceStats || { present: 0, absent: 0, leave: 0 };
            setAttendanceStats(stats);
            setRecentAttendance(dashboardData.recentAttendance || []);
            
            // Fetch users separately (not part of dashboard data) - only for admin users
            try {
                console.log('About to fetch users in Dashboard'); // Debug log
                const users = await getAllUsers();
                console.log('Users fetched in Dashboard:', users); // Debug log
                setUserCount(users.length);
            } catch (error) {
                console.warn('Could not fetch users count (non-admin user):', error.message);
                // Set userCount to 0 or keep it as is for non-admin users
                // This prevents the dashboard from breaking
            }
            
            // Fetch leave requests separately
            const leaves = await getLeaveRequests();
            setLeaveCount(leaves.length);
            const pending = leaves.filter(l => l.status === "PENDING").length;
            setPendingLeaves(pending);

        } catch (error) {
            console.error("Dashboard error:", error);
            toast.error("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    const attendanceChartData = [
        { name: "Present", count: attendanceStats.present, color: "#10b981" },
        { name: "Absent", count: attendanceStats.absent, color: "#ef4444" },
        { name: "Leave", count: attendanceStats.leave, color: "#f59e0b" },
    ];

    const COLORS = ["#10b981", "#ef4444", "#f59e0b"];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Welcome back! Here's what's happening today.
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition cursor-pointer" onClick={() => navigate("/employees")}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-bold text-blue-600">{employeeCount}</div>
                            <div className="text-gray-600 mt-1">Total Employees</div>
                        </div>
                        <FiUsers className="text-5xl text-blue-400" />
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition cursor-pointer" onClick={() => navigate("/departments")}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-bold text-green-600">{departmentCount}</div>
                            <div className="text-gray-600 mt-1">Departments</div>
                        </div>
                        <FiBriefcase className="text-5xl text-green-400" />
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition cursor-pointer" onClick={() => navigate("/attendance")}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-bold text-purple-600">{attendanceStats.present + attendanceStats.absent + attendanceStats.leave}</div>
                            <div className="text-gray-600 mt-1">Attendance Records</div>
                        </div>
                        <FiCalendar className="text-5xl text-purple-400" />
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition cursor-pointer" onClick={() => navigate("/leave-management")}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-bold text-orange-600">{pendingLeaves}</div>
                            <div className="text-gray-600 mt-1">Pending Leave Requests</div>
                            <div className="text-xs text-gray-500 mt-1">Total: {leaveCount}</div>
                        </div>
                        <FiFileText className="text-5xl text-orange-400" />
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => navigate("/employees/add")}
                        className="flex flex-col items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                        <FiUserPlus className="text-2xl text-blue-600 mb-1" />
                        <span className="text-xs font-medium text-gray-700">Add Employee</span>
                    </button>
                    <button
                        onClick={() => navigate("/departments/add")}
                        className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
                    >
                        <FiPlus className="text-3xl text-green-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Add Department</span>
                    </button>
                    <button
                        onClick={() => navigate("/attendance/add")}
                        className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                    >
                        <FiCalendar className="text-3xl text-purple-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Mark Attendance</span>
                    </button>
                    <button
                        onClick={() => navigate("/users/add")}
                        className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition"
                    >
                        <FiUsers className="text-3xl text-orange-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Add User</span>
                    </button>
                </div>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance Bar Chart */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Attendance Overview</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={attendanceChartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-green-50 p-2 rounded">
                            <div className="text-lg font-bold text-green-600">{attendanceStats.present}</div>
                            <div className="text-xs text-gray-600">Present</div>
                        </div>
                        <div className="bg-red-50 p-2 rounded">
                            <div className="text-lg font-bold text-red-600">{attendanceStats.absent}</div>
                            <div className="text-xs text-gray-600">Absent</div>
                        </div>
                        <div className="bg-orange-50 p-2 rounded">
                            <div className="text-lg font-bold text-orange-600">{attendanceStats.leave}</div>
                            <div className="text-xs text-gray-600">On Leave</div>
                        </div>
                    </div>
                </Card>

                {/* Attendance Pie Chart */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Attendance Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={attendanceChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {attendanceChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Employees */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Recent Employees</h2>
                        <button
                            onClick={() => navigate("/employees")}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            View All →
                        </button>
                    </div>
                    {recentEmployees.length > 0 ? (
                        <div className="space-y-3">
                            {recentEmployees.map((emp) => (
                                <div
                                    key={emp.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                    onClick={() => navigate(`/employees/${emp.id}/edit`)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                            {emp.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-800">{emp.name}</div>
                                            <div className="text-xs text-gray-500">{emp.email}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">{emp.department?.name || "N/A"}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">No employees yet</div>
                    )}
                </Card>

                {/* Recent Attendance */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Recent Attendance</h2>
                        <button
                            onClick={() => navigate("/attendance")}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            View All →
                        </button>
                    </div>
                    {recentAttendance.length > 0 ? (
                        <div className="space-y-3">
                            {recentAttendance.map((att) => (
                                <div
                                    key={att.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                                            {att.employee?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-800">{att.employee?.name}</div>
                                            <div className="text-xs text-gray-500">{att.date}</div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        att.status === "PRESENT"
                                            ? "bg-green-100 text-green-800"
                                            : att.status === "ABSENT"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-orange-100 text-orange-800"
                                    }`}>
                                        {att.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">No attendance records yet</div>
                    )}
                </Card>
            </div>

            {/* System Info */}
            <Card className="p-6 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-gray-700">{userCount}</div>
                        <div className="text-sm text-gray-600">System Users</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-700">{employeeCount}</div>
                        <div className="text-sm text-gray-600">Active Employees</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-700">{departmentCount}</div>
                        <div className="text-sm text-gray-600">Active Departments</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-700">
                            {((attendanceStats.present / (attendanceStats.present + attendanceStats.absent + attendanceStats.leave)) * 100 || 0).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Attendance Rate</div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
