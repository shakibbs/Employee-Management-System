import { useNavigate, useParams } from 'react-router-dom';
import { getAttendanceByUser, markAttendance } from '../../api/attendanceService';
import AttendanceForm from '../../components/forms/AttendanceForm';
import { useToast } from '../../hooks/useToast';
import { useState, useEffect } from 'react';

export default function AttendanceEdit() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    useEffect(() => {
        getAttendanceByUser(userId)
            .then((res) => setAttendance(res))
            .catch(() => toast.error('Failed to fetch attendance.'));
    }, [userId]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await markAttendance(formData); // backend should update if record exists
            toast.success('Attendance updated successfully!');
            navigate('/attendance');
        } catch {
            toast.error('Failed to update attendance.');
        } finally {
            setLoading(false);
        }
    };

    if (!attendance) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Edit Attendance</h1>
            <AttendanceForm initialData={attendance} onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
