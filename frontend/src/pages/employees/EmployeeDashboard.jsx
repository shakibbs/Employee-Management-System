import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getCurrentEmployee } from '../../api/employeeService';
import { getMyAttendance, markAttendanceForCurrentUser } from '../../api/attendanceService';
import { getMyLeaveRequests } from '../../api/leaveService';
import { getNotifications } from '../../api/notificationService';
import { Card, Button } from '../../components/ui';
import { useToast } from '../../hooks/useToast';
import { FiUser, FiClock, FiCalendar, FiBell, FiCheckCircle, FiLogIn } from 'react-icons/fi';

export default function EmployeeDashboard() {
    const { user, logout, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [departmentError, setDepartmentError] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                // Fetch notifications separately since they might fail for employees
                const [employeeData, attendanceData, leaveData] = await Promise.all([
                    getCurrentEmployee(),
                    getMyAttendance(),
                    getMyLeaveRequests()
                ]);
                
                setEmployee(employeeData);
                setAttendance(attendanceData);
                setLeaveRequests(leaveData);
                
                // Try to fetch notifications, but don't fail the whole dashboard if it fails
                try {
                    const notificationData = await getNotifications();
                    setNotifications(notificationData);
                } catch (notificationError) {
                    console.warn('Could not fetch notifications (might be restricted for employees):', notificationError);
                    setNotifications([]);
                }
                
                // Check if employee has already checked in today
                const today = new Date().toDateString();
                const todayRecord = attendanceData.find(record =>
                    new Date(record.checkIn).toDateString() === today
                );
                setTodayAttendance(todayRecord);
            } catch (error) {
                toast.error('Failed to fetch employee data');
                console.error('Error fetching employee data:', error);
                // Set empty data to prevent infinite loading
                setEmployee(null);
                setAttendance([]);
                setLeaveRequests([]);
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };

        if (user?.username && isAuthenticated) {
            fetchEmployeeData();
        } else if (!isAuthenticated && !loading) {
            setLoading(false);
        }
    }, [user?.username, isAuthenticated, loading, toast]);

    const handleCheckIn = async () => {
        setCheckingIn(true);
        try {
            await markAttendanceForCurrentUser('CHECK_IN');
            toast.success('Check-in successful!');
            // Refresh attendance data
            const updatedAttendance = await getMyAttendance();
            setAttendance(updatedAttendance);
            
            // Update today's attendance
            const today = new Date().toDateString();
            const todayRecord = updatedAttendance.find(record =>
                new Date(record.checkIn).toDateString() === today
            );
            setTodayAttendance(todayRecord);
        } catch (error) {
            toast.error('Failed to check in');
            console.error('Error checking in:', error);
        } finally {
            setCheckingIn(false);
        }
    };

    const handleCheckOut = async () => {
        setCheckingOut(true);
        try {
            await markAttendanceForCurrentUser('CHECK_OUT');
            toast.success('Check-out successful!');
            // Refresh attendance data
            const updatedAttendance = await getMyAttendance();
            setAttendance(updatedAttendance);
            
            // Update today's attendance
            const today = new Date().toDateString();
            const todayRecord = updatedAttendance.find(record =>
                new Date(record.checkIn).toDateString() === today
            );
            setTodayAttendance(todayRecord);
        } catch (error) {
            toast.error('Failed to check out');
            console.error('Error checking out:', error);
        } finally {
            setCheckingOut(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-red-600">No employee data found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-indigo-600">
                            Welcome, {employee.firstName}!
                        </div>
                        <div className="text-sm text-gray-600">
                            {employee.position} • {employee.department?.name || 'No Department'}
                        </div>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="secondary"
                        className="flex items-center gap-1 text-xs px-2 py-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors duration-200 w-20"
                    >
                        <FiLogIn className="text-xs" />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>

            {/* Quick Actions - Check In/Out */}
            <div className="mb-8">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FiClock />
                        Today's Attendance
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                            <div className="mb-4">
                                <div className={`text-3xl font-bold ${todayAttendance?.checkIn ? 'text-green-600' : 'text-gray-400'}`}>
                                    {todayAttendance?.checkIn ? 'Checked In' : 'Not Checked In'}
                                </div>
                                {todayAttendance?.checkIn && (
                                    <div className="text-sm text-gray-600">
                                        Check-in time: {new Date(todayAttendance.checkIn).toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                            {!todayAttendance?.checkIn ? (
                                <Button
                                    onClick={handleCheckIn}
                                    disabled={checkingIn}
                                    className="w-full"
                                >
                                    {checkingIn ? 'Checking In...' : 'Check In'}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleCheckOut}
                                    disabled={checkingOut || todayAttendance?.checkOut}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    {checkingOut ? 'Checking Out...' : 'Check Out'}
                                </Button>
                            )}
                            {todayAttendance?.checkOut && (
                                <div className="mt-2 text-sm text-green-600">
                                    Check-out time: {new Date(todayAttendance.checkOut).toLocaleTimeString()}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Employee Information */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiUser />
                        My Information
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm text-gray-600">Name:</span>
                            <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Email:</span>
                            <p className="font-medium">{employee.email}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Position:</span>
                            <p className="font-medium">{employee.position || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Department:</span>
                            {departmentError ? (
                                <p className="font-medium text-red-600">Error loading department</p>
                            ) : (
                                <p className="font-medium">{employee.department?.name || 'N/A'}</p>
                            )}
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Salary:</span>
                            <p className="font-medium">${employee.salary || 'N/A'}</p>
                        </div>
                    </div>
                </Card>

                {/* Recent Attendance */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiClock />
                        Recent Attendance
                    </h3>
                    <div className="space-y-3">
                        {attendance.length === 0 ? (
                            <p className="text-gray-500 text-center">No attendance records</p>
                        ) : (
                            attendance.slice(0, 5).map((record) => (
                                <div key={record.id} className="border-l-4 border-gray-200 pl-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium">
                                                {new Date(record.checkIn).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                In: {new Date(record.checkIn).toLocaleTimeString()}
                                                {record.checkOut && ` • Out: ${new Date(record.checkOut).toLocaleTimeString()}`}
                                            </p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                                            record.checkOut ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {record.checkOut ? 'Completed' : 'Active'}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {attendance.length > 5 && (
                        <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => navigate('/my-attendance')}
                        >
                            View All Attendance
                        </Button>
                    )}
                </Card>

                {/* Leave Requests */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiCalendar />
                        My Leave Requests
                    </h3>
                    <div className="space-y-3">
                        {leaveRequests.length === 0 ? (
                            <p className="text-gray-500 text-center">No leave requests</p>
                        ) : (
                            leaveRequests.slice(0, 5).map((request) => (
                                <div key={request.id} className="border-l-4 border-gray-200 pl-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium">{request.type}</p>
                                            <p className="text-xs text-gray-600">
                                                {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                                            request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {request.status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => navigate('/leave-request')}
                        >
                            Request Leave
                        </Button>
                        {leaveRequests.length > 5 && (
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => navigate('/my-leave-requests')}
                            >
                                View All
                            </Button>
                        )}
                    </div>
                </Card>

                {/* Notifications */}
                <Card className="p-6 lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiBell />
                        Recent Notifications
                    </h3>
                    <div className="space-y-3">
                        {notifications.length === 0 ? (
                            <p className="text-gray-500 text-center">No notifications</p>
                        ) : (
                            notifications.slice(0, 5).map((notification) => (
                                <div key={notification.id} className="border-l-4 border-gray-200 pl-4">
                                    <div>
                                        <p className="text-sm font-medium">{notification.message}</p>
                                        <p className="text-xs text-gray-600">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {notifications.length > 5 && (
                        <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => navigate('/notifications')}
                        >
                            View All Notifications
                        </Button>
                    )}
                </Card>
            </div>
        </div>
    );
}