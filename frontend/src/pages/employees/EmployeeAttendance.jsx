import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getMyAttendance } from '../../api/attendanceService';
import { Card } from '../../components/ui';
import { useToast } from '../../hooks/useToast';

export default function EmployeeAttendance() {
    const { user } = useContext(AuthContext);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const data = await getMyAttendance();
                setAttendance(data);
            } catch (error) {
                // Only show error message once, not in infinite loop
                if (error.response?.status === 403) {
                    toast.error('Access denied. You may not have the proper permissions.');
                } else {
                    toast.error('Failed to fetch attendance data');
                }
                console.error('Error fetching attendance:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.username) {
            fetchAttendanceData();
        }
    }, [user?.username]); // Remove toast from dependencies to prevent infinite loop

    if (loading) return <div>Loading attendance records...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Attendance</h1>
            <div className="grid gap-4">
                {attendance.length === 0 ? (
                    <Card className="p-6">
                        <div className="text-center text-gray-500">No attendance records found</div>
                    </Card>
                ) : (
                    attendance.map((record) => (
                        <Card key={record.id} className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-semibold">
                                        Date: {new Date(record.checkIn).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Check In: {new Date(record.checkIn).toLocaleTimeString()}
                                    </div>
                                    {record.checkOut && (
                                        <div className="text-sm text-gray-600">
                                            Check Out: {new Date(record.checkOut).toLocaleTimeString()}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        record.checkOut ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {record.checkOut ? 'Completed' : 'Active'}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}